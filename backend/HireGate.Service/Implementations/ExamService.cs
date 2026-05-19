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
        private readonly IQuestionRepository _questionRepository;
        private readonly IDateTimeProvider _dateTimeProvider;

        public ExamService(IExamRepository examRepository, IQuestionRepository questionRepository, IDateTimeProvider dateTimeProvider)
        {
            _examRepository = examRepository;
            _questionRepository = questionRepository;
            _dateTimeProvider = dateTimeProvider;
        }

        // ─────────────────────────────
        // GET ALL
        // ─────────────────────────────
        public async Task<(IEnumerable<ExamListDto> Exams, int TotalCount)> GetAllExamsAsync(int pageNumber, int pageSize, string? search = null)
        {
            var (exams, totalCount) = await _examRepository.GetAllExamsAsync(pageNumber, pageSize, search);
            return (exams.Select(ExamMapper.ToListDto), totalCount);
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
            var questionIds = (dto.QuestionIds ?? []).Distinct().ToList();
            var invalidIds = await _examRepository.GetNonExistentQuestionIdsAsync(questionIds);
            if (invalidIds.Any())
                 throw new InvalidQuestionIdsException(invalidIds);

            var exam = ExamMapper.ToEntity(dto);

            _examRepository.CreateExam(exam);
            await _examRepository.SaveAsync(); // exam.Id is now generated

            // Attach each question, skip any invalid IDs silently (or you can throw)
            foreach (var qId in questionIds)
            {
                    await _examRepository.AddQuestionAsync(exam.Id, qId); 
            }

            if (questionIds.Any())
                await _examRepository.SaveAsync();

            await _examRepository.SyncExamQuestionCountAsync(exam.Id);

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
            
            var addedQuestionIds = dto.AddedQuestionIds?.Distinct().ToList() ?? new List<int>();
            var removedQuestionIds = dto.RemovedQuestionIds?.Distinct().ToList() ?? new List<int>();
            var idsToValidate = addedQuestionIds.Concat(removedQuestionIds).Distinct().ToList();
            var invalidIds = await _examRepository.GetNonExistentQuestionIdsAsync(idsToValidate);
            if (invalidIds.Any())
                throw new InvalidQuestionIdsException(invalidIds);

            // Only update values that were actually sent.
            if (dto.PositionTitle is not null)
                exam.PositionTitle = dto.PositionTitle;

            if (dto.DurationMinutes.HasValue)
                exam.DurationMinutes = dto.DurationMinutes;

            if (dto.WindowStartTime.HasValue)
                exam.WindowStartTime = dto.WindowStartTime;

            if (dto.WindowEndTime.HasValue)
                exam.WindowEndTime = dto.WindowEndTime;

            // ── Sync questions ──────────────────────────────────────
            var existingIds = exam.ExamQuestions.Select(eq => eq.QuestionId).ToHashSet();

            if (removedQuestionIds.Count != 0)
            {
                var toRemove = removedQuestionIds.Where(existingIds.Contains);
                foreach (var qId in toRemove)
                    await _examRepository.RemoveQuestionAsync(id, qId);
            }

            if (addedQuestionIds.Count != 0)
            {
                var toAdd = addedQuestionIds.Where(qId => !existingIds.Contains(qId));
                foreach (var qId in toAdd)
                    await _examRepository.AddQuestionAsync(id, qId);
            }

            _examRepository.UpdateExam(exam);
            // ────────────────────────────────────────────────────────

            await _examRepository.SaveAsync();
            await _examRepository.SyncExamQuestionCountAsync(id);

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
            await _examRepository.SyncExamQuestionCountAsync(examId);
            return true;
        }

        public async Task<bool> RemoveQuestionFromExamAsync(int examId, int questionId)
               {
                if (!await _examRepository.ExamExistsAsync(examId)) return false;

                var result = await _examRepository.RemoveQuestionAsync(examId, questionId);
                if (!result) return false;

                await _examRepository.SaveAsync();
                await _examRepository.SyncExamQuestionCountAsync(examId);
                return true;
               } 
    }
}
