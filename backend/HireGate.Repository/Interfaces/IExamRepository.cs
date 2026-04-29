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
        Task<bool> QuestionExistsAsync(int questionId);
        Task<bool> QuestionAlreadyInExamAsync(int examId, int questionId);

        Task<List<int>> GetNonExistentQuestionIdsAsync(IEnumerable<int> questionIds);

        Task SaveAsync();
        
        // Submission helpers
        Task<Candidate?> GetCandidateByTokenAsync(string token);
        Task<Dictionary<int, Choice>> GetChoicesByIdsAsync(IEnumerable<int> choiceIds);
        void AddCandidateAnswers(IEnumerable<CandidateAnswer> answers);
        void UpdateCandidate(Candidate candidate);

    }
}
