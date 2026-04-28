using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface ITopicRepository
    {
        Task<Topic?> GetTopicByIdAsync(int id);
        Task<IEnumerable<Topic>> GetAllTopicsAsync();
        Task<Topic> CreateTopicAsync(Topic topic);
        Task<Topic> UpdateTopicAsync(Topic topic);
        Task<bool> DeleteTopicAsync(int id);
        Task<bool> TopicExistsAsync(int id);
        Task<bool> TopicNameExistsAsync(string topicName);

    }
}
