using HireGate.Data.Models;
using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface IExamService
    {
        Task<IEnumerable<ExamDto>> GetAllExamsAsync();
        Task<ExamDto?> GetExamByIdAsync(int id);
        Task<ExamDto> CreateExamAsync(CreateExamDto examDto);

        Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto examDto);

        Task<bool> DeleteExamAsync(int id);

        Task<IEnumerable<Question>> GetExamQuestionsAsync(int examId);
        Task<bool> AddQuestionToExamAsync(int examId, int questionId);
        Task<bool> RemoveQuestionFromExamAsync(int examId, int questionId);
        
        Task SubmitExamAsync(SubmitExamDto dto);

    }
}
