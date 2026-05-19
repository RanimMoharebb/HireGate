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
        private readonly IExamQuestionRepository _examQuestionRepository;
        private readonly IQuestionRepository _questionRepository;

        public ExamService(
            IExamRepository examRepository,
            IExamQuestionRepository examQuestionRepository,
            IQuestionRepository questionRepository)
        {
            _examRepository = examRepository;
            _examQuestionRepository = examQuestionRepository;
            _questionRepository = questionRepository;
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
        // CREATE
        // ─────────────────────────────
        public async Task<ExamDto> CreateExamAsync(CreateExamDto dto)
        {
            var questionIds = (dto.QuestionIds ?? []).Distinct().ToList();
            var invalidIds = await _examQuestionRepository.GetNonExistentQuestionIdsAsync(questionIds);
            if (invalidIds.Any()) throw new InvalidQuestionIdsException(invalidIds);

            var exam = ExamMapper.ToEntity(dto);
            _examRepository.CreateExam(exam);
            await _examRepository.SaveAsync();

            foreach (var qId in questionIds)
                _examQuestionRepository.AddQuestion(exam.Id, qId);

            if (questionIds.Any())
                await _examQuestionRepository.SaveAsync();

            await _examQuestionRepository.SyncExamQuestionCountAsync(exam.Id);

            var created = await _examRepository.GetExamByIdAsync(exam.Id);
            return ExamMapper.ToDto(created!);
        }

        // ─────────────────────────────
        // UPDATE
        // ─────────────────────────────
        public async Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto dto)
        {
            var exam = await _examRepository.GetExamByIdForUpdateAsync(id);
            if (exam is null) return null;

            var addedQuestionIds = dto.AddedQuestionIds?.Distinct().ToList() ?? [];
            var removedQuestionIds = dto.RemovedQuestionIds?.Distinct().ToList() ?? [];
            var idsToValidate = addedQuestionIds.Concat(removedQuestionIds).Distinct().ToList();
            var invalidIds = await _examQuestionRepository.GetNonExistentQuestionIdsAsync(idsToValidate);
            if (invalidIds.Any()) throw new InvalidQuestionIdsException(invalidIds);

            if (dto.PositionTitle is not null) exam.PositionTitle = dto.PositionTitle;
            if (dto.DurationMinutes.HasValue) exam.DurationMinutes = dto.DurationMinutes;
            if (dto.WindowStartTime.HasValue) exam.WindowStartTime = dto.WindowStartTime;
            if (dto.WindowEndTime.HasValue) exam.WindowEndTime = dto.WindowEndTime;

            var existingIds = exam.ExamQuestions.Select(eq => eq.QuestionId).ToHashSet();

            foreach (var qId in removedQuestionIds.Where(existingIds.Contains))
                await _examQuestionRepository.RemoveQuestionAsync(id, qId);

            foreach (var qId in addedQuestionIds.Where(qId => !existingIds.Contains(qId)))
                _examQuestionRepository.AddQuestion(id, qId);

            _examRepository.UpdateExam(exam);
            await _examRepository.SaveAsync();
            await _examQuestionRepository.SyncExamQuestionCountAsync(id);

            var updated = await _examRepository.GetExamByIdAsync(id);
            return ExamMapper.ToDto(updated!);
        }

        // ─────────────────────────────
        // DELETE
        // ─────────────────────────────
        public async Task<bool> DeleteExamAsync(int id)
        {
            return await _examRepository.DeleteExamByIdAsync(id); // ✅ no loading, no tracking issues
        }
        // ─────────────────────────────
        // QUESTIONS MANAGEMENT
        // ─────────────────────────────
        public async Task<IEnumerable<Question>> GetExamQuestionsAsync(int examId)
            => await _examQuestionRepository.GetQuestionsAsync(examId);

        public async Task<bool> AddQuestionToExamAsync(int examId, int questionId)
        {
            if (!await _examQuestionRepository.ExamExistsAsync(examId)) return false;
            if (!await _examQuestionRepository.QuestionExistsAsync(questionId)) return false;
            if (await _examQuestionRepository.QuestionAlreadyInExamAsync(examId, questionId)) return false;

            _examQuestionRepository.AddQuestion(examId, questionId);
            await _examQuestionRepository.SaveAsync();
            await _examQuestionRepository.SyncExamQuestionCountAsync(examId);
            return true;
        }

        public async Task<bool> RemoveQuestionFromExamAsync(int examId, int questionId)
        {
            if (!await _examQuestionRepository.ExamExistsAsync(examId)) return false;

            bool result = await _examQuestionRepository.RemoveQuestionAsync(examId, questionId);
            if (!result) return false;

            await _examQuestionRepository.SaveAsync();
            await _examQuestionRepository.SyncExamQuestionCountAsync(examId);
            return true;
        }
    }
}