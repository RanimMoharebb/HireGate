using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionDto?> GetQuestionByIdAsync(int id);
        Task<(IEnumerable<QuestionDto> Items, int TotalCount)> GetAllQuestionsAsync(int pageNumber, int pageSize, int? topicId = null);
        Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto createQuestionDto);
        Task<QuestionDto> UpdateQuestionAsync(int id, UpdateQuestionDto updateQuestionDto);
        Task<QuestionDto> PatchQuestionAsync(int id, PatchQuestionDto patchQuestionDto);
        Task<bool> DeleteQuestionAsync(int id);
    }
}