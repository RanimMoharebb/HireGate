using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Interfaces;
using HireGate.Service.Mappers;
using HireGate.Service.Exceptions;

namespace HireGate.Service.Implementations
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;

        public ExamService(IExamRepository examRepository)
        {
                _examRepository = examRepository;
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
