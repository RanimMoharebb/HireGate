using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface IQuestionRepository
    {
        Task<Question?> GetQuestionByIdAsync(int id);
        Task<(IEnumerable<Question> Items, int TotalCount)> GetAllQuestionsAsync(int pageNumber, int pageSize, int? topicId = null);
        Task <Question> CreateQuestionAsync(Question question);
        Task <Question> UpdateQuestionAsync(Question question);
        Task<bool> DeleteQuestionAsync(int id);
  
        Task<bool> QuestionExistsAsync(int id);
    
    }
}