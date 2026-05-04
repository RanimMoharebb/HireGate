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

        public async Task<(IEnumerable<Question> Items, int TotalCount)> GetAllQuestionsAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _context.Questions.CountAsync();
            var items = await _context.Questions
                .Include(q => q.Topic)
                .Include(q => q.Choices)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }

        public async Task<IEnumerable<Question>> GetQuestionsByTopicIdAsync(int topicId)
        {
            return await _context.Questions
                .Where(q => q.TopicId == topicId)
                .Include(q => q.Topic)
                .Include(q => q.Choices)
                .ToListAsync();
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
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
          public async Task<bool> QuestionExistsAsync(int id)
        {
            return await _context.Questions.AnyAsync(q => q.Id == id);
        }
    }
}
