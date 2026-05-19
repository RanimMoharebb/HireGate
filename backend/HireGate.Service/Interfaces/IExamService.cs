using HireGate.Data.Models;
using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface IExamService
    {
        Task<(IEnumerable<ExamListDto> Exams, int TotalCount)> GetAllExamsAsync(int pageNumber, int pageSize, string? search = null);
        Task<ExamDto?> GetExamByIdAsync(int id);
        Task<ExamDto> CreateExamAsync(CreateExamDto examDto);

        Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto examDto);

        Task<bool> DeleteExamAsync(int id);

        Task<IEnumerable<Question>> GetExamQuestionsAsync(int examId);
        Task<bool> AddQuestionToExamAsync(int examId, int questionId);
        Task<bool> RemoveQuestionFromExamAsync(int examId, int questionId);
        

    }
}
