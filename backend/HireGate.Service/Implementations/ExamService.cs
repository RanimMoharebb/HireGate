using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Interfaces;
using HireGate.Service.Mappers;

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
            var exam = ExamMapper.ToEntity(dto);

            _examRepository.CreateExam(exam);
            await _examRepository.SaveAsync();

            return ExamMapper.ToDto(exam);
        }

        // ─────────────────────────────
        // UPDATE EXAM
        // ─────────────────────────────
        public async Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto dto)
        {
            var exam = await _examRepository.GetExamByIdAsync(id);

            if (exam is null)
                return null;

            exam.PositionTitle = dto.PositionTitle;
            exam.DurationMinutes = dto.DurationMinutes;
            exam.WindowStartTime = dto.WindowStartTime;
            exam.WindowEndTime = dto.WindowEndTime;

            _examRepository.UpdateExam(exam);
            await _examRepository.SaveAsync();

            return ExamMapper.ToDto(exam);
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
