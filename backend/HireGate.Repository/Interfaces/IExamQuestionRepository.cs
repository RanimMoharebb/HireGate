using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface IExamQuestionRepository
    {
        void AddQuestion(int examId, int questionId);
        Task<bool> RemoveQuestionAsync(int examId, int questionId);  // ← Task<bool> not Task
        Task<IEnumerable<Question>> GetQuestionsAsync(int examId);
        Task<bool> ExamExistsAsync(int examId);
        Task<bool> QuestionExistsAsync(int questionId);
        Task<bool> QuestionAlreadyInExamAsync(int examId, int questionId);
        Task<List<int>> GetNonExistentQuestionIdsAsync(IEnumerable<int> questionIds);
        Task SyncExamQuestionCountAsync(int examId);
        Task SaveAsync();
    }
}