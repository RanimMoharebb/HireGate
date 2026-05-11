using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly AppDbContext _context;

        public QuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            return await _context.Questions
                .Include(q => q.Topic)
                .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<(IEnumerable<Question> Items, int TotalCount)> GetAllQuestionsAsync(int pageNumber, int pageSize, int? topicId = null, string? search = null, bool? isDeleted = false)
        {
            IQueryable<Question> query = _context.Questions;

            if (isDeleted.HasValue)
            {
                query = isDeleted.Value
                    ? query.Where(q => q.DeletedAt != null)
                    : query.Where(q => q.DeletedAt == null);
            }

            if (topicId.HasValue)
            {
                query = query.Where(q => q.TopicId == topicId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(q => q.QuestionText.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(q => q.Topic)
                .Include(q => q.Choices)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }

        public async Task<Question> CreateQuestionAsync(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<Question> UpdateQuestionAsync(Question question)
        {
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == id && q.DeletedAt == null);
            if (question == null)
                return false;

            question.DeletedAt = DateTime.UtcNow;
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RestoreQuestionAsync(int id)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == id && q.DeletedAt != null);
            if (question == null)
                return false;

            question.DeletedAt = null;
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
            return true;
        }
          public async Task<bool> QuestionExistsAsync(int id)
        {
            return await _context.Questions.AnyAsync(q => q.Id == id && q.DeletedAt == null);
        }

        public async Task<bool> QuestionExistsIncludingDeletedAsync(int id)
        {
            return await _context.Questions.AnyAsync(q => q.Id == id);
        }
    }
}
