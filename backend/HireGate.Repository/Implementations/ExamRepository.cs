using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{

    public class ExamRepository : IExamRepository
    {
        private readonly AppDbContext _context;

        public ExamRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all exams only (without related questions/choices)
        public async Task<(IEnumerable<Exam> Exams, int TotalCount)> GetAllExamsAsync(int pageNumber, int pageSize, string? search = null)
        {
            IQueryable<Exam> query = _context.Exams.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(e => e.PositionTitle != null && e.PositionTitle.ToLower().Contains(term));
            }

            var totalCount = await query.CountAsync();

            var exams = await query
                .OrderByDescending(e => e.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (exams, totalCount);
        }

        // Get Exam by id with its Qs and Chs
        public async Task<Exam?> GetExamByIdAsync(int id)
        {
            return await _context.Exams
                .AsNoTracking()
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Choices)
                .Include(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Topic)
                .AsSplitQuery()
                .FirstOrDefaultAsync(e => e.Id == id);
        } 
        
        // Create, Update, Delete Exam
         public void CreateExam(Exam exam)
        {
            _context.Exams.Add(exam);
            
        }
        public void UpdateExam(Exam exam)
        {
            _context.Exams.Update(exam);
        }
        public void DeleteExam(Exam exam)
            {
            _context.Exams.Remove(exam);
            }
        // Questions management for an Exam
        // Get Questions of an Exam with their Choices and Topics
        public async Task<IEnumerable<Question>> GetQuestionsAsync(int examId)
        {
            return await _context.ExamQuestions
                .Where(eq => eq.ExamId == examId)
                .Include(eq => eq.Question)
                    .ThenInclude(q => q.Choices)
                .Include(eq => eq.Question)
                    .ThenInclude(q => q.Topic)
                .Select(eq => eq.Question)
                .ToListAsync();
        }

        // Add existing Question to an Exam, ensuring no duplicates
        public Task AddQuestionAsync(int examId, int questionId)
            {
            _context.ExamQuestions.Add(new ExamQuestion
            {
                ExamId = examId,
                QuestionId = questionId
            });

            return Task.CompletedTask;
            }

        // Remove a Question from an Exam
        public async Task<bool> RemoveQuestionAsync(int examId, int questionId)
        {
            var examQuestion = await _context.ExamQuestions
                .FirstOrDefaultAsync(eq => eq.ExamId == examId && eq.QuestionId == questionId);

            if (examQuestion is null) return false;

            _context.ExamQuestions.Remove(examQuestion);
            return true;
        }

        public async Task<List<int>> GetNonExistentQuestionIdsAsync(IEnumerable<int> questionIds)
        {
            var ids = questionIds.Distinct().ToList();
            if (ids.Count == 0)
            {
                return [];
            }

            var existingIds = await _context.Questions
                .Where(q => ids.Contains(q.Id))
                .Select(q => q.Id)
                .ToListAsync();

            return ids.Except(existingIds).ToList();
        }

        public async Task SyncExamQuestionCountAsync(int examId)
        {
            var count = await _context.ExamQuestions.CountAsync(eq => eq.ExamId == examId);
            await _context.Exams
                .Where(e => e.Id == examId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(e => e.QuestionCount, count));
        }

        // Helper methods for validation
        public async Task<bool> ExamExistsAsync(int examId)
            => await _context.Exams.AnyAsync(e => e.Id == examId);

        public async Task<bool> QuestionExistsAsync(int questionId)
            => await _context.Questions.AnyAsync(q => q.Id == questionId);

        public async Task<bool> QuestionAlreadyInExamAsync(int examId, int questionId)
            => await _context.ExamQuestions
                .AnyAsync(eq => eq.ExamId == examId && eq.QuestionId == questionId);

        // Save changes to the database
        public async Task SaveAsync()
            {
            await _context.SaveChangesAsync();
            }

        // Submission helpers
        public async Task<Candidate?> GetCandidateByTokenAsync(string token)
            => await _context.Candidates.Include(c => c.Exam).FirstOrDefaultAsync(c => c.Token == token);


        public async Task<Dictionary<int, Choice>> GetChoicesByIdsAsync(IEnumerable<int> choiceIds)
            => await _context.Choices.Where(c => choiceIds.Contains(c.Id)).ToDictionaryAsync(c => c.Id);

        public void AddCandidateAnswers(IEnumerable<CandidateAnswer> answers)
        {
            _context.CandidateAnswers.AddRange(answers);
        }

        public void UpdateCandidate(Candidate candidate)
        {
            _context.Candidates.Update(candidate);
        }

}
}
