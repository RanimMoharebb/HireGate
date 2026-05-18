using HireGate.Service.DTOs;
using HireGate.Repository.Interfaces;
using HireGate.Data.Models;
using HireGate.Service.Interfaces;

namespace HireGate.Service.Implementations
{
    public class TopicService : ITopicService
    {
        private readonly ITopicRepository _repository;

        public TopicService(ITopicRepository repository)
        {
            _repository = repository;
        }

        public async Task<TopicDto?> GetTopicByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid topic ID", nameof(id));

            var topic = await _repository.GetTopicByIdAsync(id);
            return topic == null ? null : MapToTopicDto(topic);
        }

        public async Task<IEnumerable<TopicDto>> GetAllTopicsAsync()
        {
            var topics = await _repository.GetAllTopicsAsync();
            return topics.Select(MapToTopicDto).ToList();
        }

        public async Task<TopicDto> CreateTopicAsync(CreateUpdateTopicDto createTopicDto)
        {
            if (createTopicDto == null)
                throw new ArgumentNullException(nameof(createTopicDto));

            if (string.IsNullOrWhiteSpace(createTopicDto.TopicName))
                throw new ArgumentException("Topic name is required");

            var normalizedTopicName = createTopicDto.TopicName.Trim();

            if (await _repository.TopicNameExistsAsync(normalizedTopicName))
                throw new ArgumentException("Topic name already exists");

            var topic = new Topic
            {
                TopicName = normalizedTopicName
            };

            var createdTopic = await _repository.CreateTopicAsync(topic);
            return MapToTopicDto(createdTopic);
        }

        public async Task<TopicDto> UpdateTopicAsync(int id, CreateUpdateTopicDto updateTopicDto)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid topic ID", nameof(id));

            if (updateTopicDto == null)
                throw new ArgumentNullException(nameof(updateTopicDto));

            var existingTopic = await _repository.GetTopicByIdAsync(id);
            if (existingTopic == null)
                throw new KeyNotFoundException($"Topic with ID {id} not found");

            if (string.IsNullOrWhiteSpace(updateTopicDto.TopicName))
                throw new ArgumentException("Topic name is required", nameof(updateTopicDto.TopicName));

            existingTopic.TopicName = updateTopicDto.TopicName.Trim();

            var updatedTopic = await _repository.UpdateTopicAsync(existingTopic);
            return MapToTopicDto(updatedTopic);
        }

            
        public async Task<bool> DeleteTopicAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid topic ID", nameof(id));

            var exists = await _repository.TopicExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Topic with ID {id} not found");

            return await _repository.DeleteTopicAsync(id);
        }

        private TopicDto MapToTopicDto(Topic topic)
        {
            return new TopicDto
            {
                Id = topic.Id,
                TopicName = topic.TopicName
            };
        }
    }
}
