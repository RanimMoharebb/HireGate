using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface IExamRepository
    {
        // Exam CRUD operations
        Task<IEnumerable<Exam>> GetAllExamsAsync();
        Task<Exam?> GetExamByIdAsync(int id);
        void CreateExam(Exam exam);
        void UpdateExam(Exam exam);
        void DeleteExam(Exam exam);

        // Exam-Question relationship operations
        Task<IEnumerable<Question>> GetQuestionsAsync(int examId);
        Task AddQuestionAsync(int examId, int questionId);
        Task<bool> RemoveQuestionAsync(int examId, int questionId);
        Task<bool> ExamExistsAsync(int examId);
        Task<bool> QuestionAlreadyInExamAsync(int examId, int questionId);

        Task SaveAsync();

    }
}
