using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Implementations;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace HireGate.Repository.Tests
{
    public class TopicRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly TopicRepository _repository;

        public TopicRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new TopicRepository(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetTopicByIdAsync_ShouldReturnTopic_WhenExists()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTopicByIdAsync(topic.Id);

            // Assert
            result.Should().NotBeNull();
            result!.TopicName.Should().Be("Test Topic");
        }

        [Fact]
        public async Task GetTopicByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetTopicByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetAllTopicsAsync_ShouldReturnAllTopics()
        {
            // Arrange
            var topics = new List<Topic>
            {
                new Topic { TopicName = "Topic 1" },
                new Topic { TopicName = "Topic 2" }
            };
            _context.Topics.AddRange(topics);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllTopicsAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Select(t => t.TopicName).Should().Contain(new[] { "Topic 1", "Topic 2" });
        }

        [Fact]
        public async Task CreateTopicAsync_ShouldAddTopicToDatabase()
        {
            // Arrange
            var topic = new Topic { TopicName = "New Topic" };

            // Act
            var result = await _repository.CreateTopicAsync(topic);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.TopicName.Should().Be("New Topic");

            var savedTopic = await _context.Topics.FindAsync(result.Id);
            savedTopic.Should().NotBeNull();
            savedTopic!.TopicName.Should().Be("New Topic");
        }

        [Fact]
        public async Task UpdateTopicAsync_ShouldUpdateTopicInDatabase()
        {
            // Arrange
            var topic = new Topic { TopicName = "Original Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            topic.TopicName = "Updated Topic";

            // Act
            var result = await _repository.UpdateTopicAsync(topic);

            // Assert
            result.Should().NotBeNull();
            result.TopicName.Should().Be("Updated Topic");

            var updatedTopic = await _context.Topics.FindAsync(topic.Id);
            updatedTopic.Should().NotBeNull();
            updatedTopic!.TopicName.Should().Be("Updated Topic");
        }

        [Fact]
        public async Task DeleteTopicAsync_ShouldRemoveTopicFromDatabase()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.DeleteTopicAsync(topic.Id);

            // Assert
            result.Should().BeTrue();

            var deletedTopic = await _context.Topics.FindAsync(topic.Id);
            deletedTopic.Should().BeNull();
        }

        [Fact]
        public async Task DeleteTopicAsync_ShouldReturnFalse_WhenTopicNotExists()
        {
            // Act
            var result = await _repository.DeleteTopicAsync(999);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task TopicExistsAsync_ShouldReturnTrue_WhenExists()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.TopicExistsAsync(topic.Id);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task TopicExistsAsync_ShouldReturnFalse_WhenNotExists()
        {
            // Act
            var result = await _repository.TopicExistsAsync(999);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task TopicNameExistsAsync_ShouldReturnTrue_WhenExists()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.TopicNameExistsAsync("Test Topic");

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task TopicNameExistsAsync_ShouldReturnTrue_WhenExistsWithDifferentCase()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.TopicNameExistsAsync("test topic");

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task TopicNameExistsAsync_ShouldReturnFalse_WhenNotExists()
        {
            // Act
            var result = await _repository.TopicNameExistsAsync("Nonexistent Topic");

            // Assert
            result.Should().BeFalse();
        }
    }
}