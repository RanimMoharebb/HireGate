using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Interfaces;
using HireGate.Service.Mappers;
using HireGate.Service.Exceptions;
using HireGate.Service.DTOs;

namespace HireGate.Service.Implementations
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;
        private readonly IQuestionRepository _questionRepository;

        public ExamService(IExamRepository examRepository, IQuestionRepository questionRepository)
        {
            _examRepository = examRepository;
            _questionRepository = questionRepository;
        }

        public async Task SubmitExamAsync(SubmitExamDto dto)
        {
            var now = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(dto.Token))
            {
                throw new InvalidOperationException("Token is required.");
            }

            var candidate = await _examRepository.GetCandidateByTokenAsync(dto.Token);
            if (candidate is null)
            {
                throw new InvalidOperationException("Invalid token or candidate not found.");
            }

            var exam = candidate.Exam;

            // Window checks
            if (exam.WindowStartTime.HasValue && DateTime.UtcNow < exam.WindowStartTime.Value)
            {
                throw new InvalidOperationException("Exam window has not started yet.");
            }

            if (exam.WindowEndTime.HasValue && DateTime.UtcNow > exam.WindowEndTime.Value)
            {
                throw new InvalidOperationException("Exam window has expired.");
            }

            // Duration check
            if (candidate.StartedAt.HasValue && exam.DurationMinutes.HasValue)
            {
                var elapsed = (DateTime.UtcNow - candidate.StartedAt.Value).TotalMinutes;
                if (elapsed > exam.DurationMinutes.Value)
                {
                    throw new InvalidOperationException("Exam duration exceeded.");
                }
            }

            // Validate choices and questions
            var choiceIds = dto.Answers.Select(a => a.ChoiceId).Distinct();
            var choices = await _examRepository.GetChoicesByIdsAsync(choiceIds);

            // Ensure the provided question IDs exist in the questions table
            var questionIds = dto.Answers.Select(a => a.QuestionId).Distinct();
            foreach (var qid in questionIds)
            {
                if (!await _questionRepository.QuestionExistsAsync(qid))
                {
                    throw new InvalidOperationException($"Question with id {qid} not found.");
                }
            }

            // Ensure questions belong to this exam
            var examQuestions = await _examRepository.GetQuestionsAsync(candidate.ExamId);
            var examQuestionIds = examQuestions.Select(q => q.Id).ToHashSet();

            var candidateAnswers = new List<CandidateAnswer>();
            int score = 0;

            foreach (var a in dto.Answers)
            {
                if (!examQuestionIds.Contains(a.QuestionId))
                {
                    throw new InvalidOperationException($"Question with id {a.QuestionId} not found in the exam.");
                }

                if (!choices.TryGetValue(a.ChoiceId, out var choice))
                {
                    throw new InvalidOperationException($"Choice with id {a.ChoiceId} not found.");
                }

                // ensure choice belongs to the provided question
                if (choice.QuestionId != a.QuestionId)
                {
                    throw new InvalidOperationException($"Choice with id {a.ChoiceId} does not belong to question {a.QuestionId}.");
                }

                var isCorrect = choice.IsCorrect;
                if (isCorrect) score++;

                candidateAnswers.Add(new CandidateAnswer
                {
                    CandidateId = candidate.Id,
                    ExamId = candidate.ExamId,
                    QuestionId = a.QuestionId,
                    ChoiceId = a.ChoiceId,
                    IsCorrect = isCorrect
                });
            }

            // persist
            _examRepository.AddCandidateAnswers(candidateAnswers);

            candidate.SubmittedAt = now;
            candidate.FinalScore = score;
            candidate.Token = null;

            _examRepository.UpdateCandidate(candidate);
            await _examRepository.SaveAsync();
            return;
        }

        // ─────────────────────────────
        // GET ALL
        // ─────────────────────────────
        public async Task<IEnumerable<ExamDto>> GetAllExamsAsync()
        {
            var exams = await _examRepository.GetAllExamsAsync();
            return exams.Select(ExamMapper.ToDto);
        }

        // ─────────────────────────────
        // GET BY ID
        // ─────────────────────────────
        public async Task<ExamDto?> GetExamByIdAsync(int id)
        {
            var exam = await _examRepository.GetExamByIdAsync(id);
            return exam is null ? null : ExamMapper.ToDto(exam);
        }

        // ─────────────────────────────
        // CREATE EXAM
        // ─────────────────────────────
        public async Task<ExamDto> CreateExamAsync(CreateExamDto dto)
        {
            var questionIds = dto.QuestionIds ?? [];
            var invalidIds = await _examRepository.GetNonExistentQuestionIdsAsync(questionIds);
            if (invalidIds.Any())
                 throw new InvalidQuestionIdsException(invalidIds);

            var exam = ExamMapper.ToEntity(dto);

            _examRepository.CreateExam(exam);
            await _examRepository.SaveAsync(); // exam.Id is now generated

            // Attach each question, skip any invalid IDs silently (or you can throw)
            foreach (var qId in questionIds.Distinct())
            {
                    await _examRepository.AddQuestionAsync(exam.Id, qId); 
            }

            if (questionIds.Any())
                await _examRepository.SaveAsync();

            // Re-fetch so the returned DTO includes the questions with their data
            var created = await _examRepository.GetExamByIdAsync(exam.Id);
            return ExamMapper.ToDto(created!);
        }
        // ─────────────────────────────
        // UPDATE EXAM
        // ─────────────────────────────
       public async Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto dto)
        {
            var exam = await _examRepository.GetExamByIdAsync(id);

            if (exam is null)
                return null;
            
            var questionIds = dto.QuestionIds ?? [];
            var invalidIds = await _examRepository.GetNonExistentQuestionIdsAsync(questionIds);
            if (invalidIds.Any())
                throw new InvalidQuestionIdsException(invalidIds);

            // Update basic fields
            exam.PositionTitle = dto.PositionTitle;
            exam.DurationMinutes = dto.DurationMinutes;
            exam.WindowStartTime = dto.WindowStartTime;
            exam.WindowEndTime = dto.WindowEndTime;

            _examRepository.UpdateExam(exam);

            // ── Sync questions ──────────────────────────────────────
            var existingIds = exam.ExamQuestions.Select(eq => eq.QuestionId).ToHashSet();
            var newIds = questionIds.Distinct().ToHashSet();

            // Remove questions that are no longer in the list
            var toRemove = existingIds.Except(newIds);
            foreach (var qId in toRemove)
                await _examRepository.RemoveQuestionAsync(id, qId);

            // Add questions that weren't there before
            var toAdd = newIds.Except(existingIds);
            foreach (var qId in toAdd)
                if (await _examRepository.QuestionExistsAsync(qId))
                    await _examRepository.AddQuestionAsync(id, qId);
            // ────────────────────────────────────────────────────────

            await _examRepository.SaveAsync();

            // Re-fetch so returned DTO reflects the updated questions
            var updated = await _examRepository.GetExamByIdAsync(id);
            return ExamMapper.ToDto(updated!);
        }

        // ─────────────────────────────
        // DELETE EXAM
        // ─────────────────────────────
        public async Task<bool> DeleteExamAsync(int id)
        {   
            var exam = await _examRepository.GetExamByIdAsync(id);

            if (exam is null)
                    return false;

            _examRepository.DeleteExam(exam);
            await _examRepository.SaveAsync();
            return true;        
        }

        // ─────────────────────────────
        // QUESTIONS MANAGEMENT
        // ───────────────────────────── 

        public async Task<IEnumerable<Question>> GetExamQuestionsAsync(int examId)
             => await _examRepository.GetQuestionsAsync(examId);


        public async Task<bool> AddQuestionToExamAsync(int examId, int questionId)
        {
            if (!await _examRepository.ExamExistsAsync(examId)) return false;
            if (!await _examRepository.QuestionExistsAsync(questionId)) return false;
            if (await _examRepository.QuestionAlreadyInExamAsync(examId, questionId)) return false;

            await _examRepository.AddQuestionAsync(examId, questionId);
            await _examRepository.SaveAsync();
            return true;
        }

        public async Task<bool> RemoveQuestionFromExamAsync(int examId, int questionId)
               {
                if (!await _examRepository.ExamExistsAsync(examId)) return false;

                var result = await _examRepository.RemoveQuestionAsync(examId, questionId);
                if (!result) return false;

                await _examRepository.SaveAsync();
                return true;
               } 
    }
}
