using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{
    public class TopicRepository : ITopicRepository
    {
        private readonly AppDbContext _context;

        public TopicRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Topic?> GetTopicByIdAsync(int id)
        {
            return await _context.Topics
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<Topic>> GetAllTopicsAsync()
        {
            return await _context.Topics
                .ToListAsync();
        }

        public async Task<Topic> CreateTopicAsync(Topic topic)
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();
            return topic;
        }

        public async Task<Topic> UpdateTopicAsync(Topic topic)
        {
            _context.Topics.Update(topic);
            await _context.SaveChangesAsync();
            return topic;
        }

        public async Task<bool> DeleteTopicAsync(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return false;

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> TopicExistsAsync(int id)
        {
            return await _context.Topics.AnyAsync(t => t.Id == id);
        }

        public async Task<bool> TopicNameExistsAsync(string topicName)
        {
            var normalizedTopicName = topicName.Trim().ToLower();
            return await _context.Topics.AnyAsync(t => t.TopicName.ToLower() == normalizedTopicName);
        }

    }
}
