using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{
    public class ExamQuestionRepository : IExamQuestionRepository
    {
        private readonly AppDbContext _context;

        public ExamQuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ void — not fake async
        public void AddQuestion(int examId, int questionId)
        {
            _context.ExamQuestions.Add(new ExamQuestion
            {
                ExamId = examId,
                QuestionId = questionId
            });
        }

        // ✅ Task<bool> — matches interface
        public async Task<bool> RemoveQuestionAsync(int examId, int questionId)
        {
            var examQuestion = await _context.ExamQuestions
                .FirstOrDefaultAsync(eq => eq.ExamId == examId && eq.QuestionId == questionId);

            if (examQuestion is null) return false;

            _context.ExamQuestions.Remove(examQuestion);
            return true;
        }

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

        public async Task<bool> ExamExistsAsync(int examId)
            => await _context.Exams.AnyAsync(e => e.Id == examId);

        public async Task<bool> QuestionExistsAsync(int questionId)
            => await _context.Questions.AnyAsync(q => q.Id == questionId);

        public async Task<bool> QuestionAlreadyInExamAsync(int examId, int questionId)
            => await _context.ExamQuestions
                .AnyAsync(eq => eq.ExamId == examId && eq.QuestionId == questionId);

        public async Task<List<int>> GetNonExistentQuestionIdsAsync(IEnumerable<int> questionIds)
        {
            var ids = questionIds.Distinct().ToList();
            if (ids.Count == 0) return [];

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
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.QuestionCount, count));
        }

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}