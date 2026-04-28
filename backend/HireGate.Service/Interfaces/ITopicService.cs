using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface ITopicService
    {
        Task<TopicDto?> GetTopicByIdAsync(int id);
        Task<IEnumerable<TopicDto>> GetAllTopicsAsync();
        Task<TopicDto> CreateTopicAsync(CreateUpdateTopicDto createTopicDto);
        Task<TopicDto> UpdateTopicAsync(int id, CreateUpdateTopicDto updateTopicDto);
        Task<bool> DeleteTopicAsync(int id);
    }
}
