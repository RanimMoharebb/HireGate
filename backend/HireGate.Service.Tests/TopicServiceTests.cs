using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Implementations;
using FluentAssertions;
using Moq;
using Xunit;

namespace HireGate.Service.Tests
{
    public class TopicServiceTests
    {
        private readonly Mock<ITopicRepository> _topicRepositoryMock;
        private readonly TopicService _topicService;

        public TopicServiceTests()
        {
            _topicRepositoryMock = new Mock<ITopicRepository>();
            _topicService = new TopicService(_topicRepositoryMock.Object);
        }

        #region GetTopicByIdAsync Tests

        [Fact]
        public async Task GetTopicByIdAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _topicService.GetTopicByIdAsync(0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid topic ID*");
        }

        [Fact]
        public async Task GetTopicByIdAsync_ShouldReturnNull_WhenTopicDoesNotExist()
        {
            // Arrange
            _topicRepositoryMock.Setup(r => r.GetTopicByIdAsync(1)).ReturnsAsync((Topic)null!);

            // Act
            var result = await _topicService.GetTopicByIdAsync(1);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetTopicByIdAsync_ShouldReturnTopicDto_WhenTopicExists()
        {
            // Arrange
            var topic = new Topic { Id = 1, TopicName = "Test Topic" };
            _topicRepositoryMock.Setup(r => r.GetTopicByIdAsync(1)).ReturnsAsync(topic);

            // Act
            var result = await _topicService.GetTopicByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.TopicName.Should().Be("Test Topic");
        }

        #endregion

        #region GetAllTopicsAsync Tests

        [Fact]
        public async Task GetAllTopicsAsync_ShouldReturnAllTopicsAsDtos()
        {
            // Arrange
            var topics = new List<Topic>
            {
                new Topic { Id = 1, TopicName = "Topic 1" },
                new Topic { Id = 2, TopicName = "Topic 2" }
            };
            _topicRepositoryMock.Setup(r => r.GetAllTopicsAsync()).ReturnsAsync(topics);

            // Act
            var result = await _topicService.GetAllTopicsAsync();

            // Assert
            result.Should().HaveCount(2);
            result.First().Id.Should().Be(1);
            result.First().TopicName.Should().Be("Topic 1");
            result.Last().TopicName.Should().Be("Topic 2");
        }

        [Fact]
        public async Task GetAllTopicsAsync_ShouldReturnEmptyList_WhenNoTopicsExist()
        {
            // Arrange
            _topicRepositoryMock.Setup(r => r.GetAllTopicsAsync()).ReturnsAsync(new List<Topic>());

            // Act
            var result = await _topicService.GetAllTopicsAsync();

            // Assert
            result.Should().BeEmpty();
        }

        #endregion

        #region CreateTopicAsync Tests

        [Fact]
        public async Task CreateTopicAsync_ShouldThrowArgumentNullException_WhenCreateTopicDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _topicService.CreateTopicAsync(null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("createTopicDto");
        }

        [Fact]
        public async Task CreateTopicAsync_ShouldThrowArgumentException_WhenTopicNameIsEmpty()
        {
            // Arrange
            var createTopicDto = new CreateUpdateTopicDto { TopicName = "" };

            // Act
            Func<Task> act = async () => await _topicService.CreateTopicAsync(createTopicDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Topic name is required*");
        }

        [Fact]
        public async Task CreateTopicAsync_ShouldThrowArgumentException_WhenTopicNameAlreadyExists()
        {
            // Arrange
            var createTopicDto = new CreateUpdateTopicDto { TopicName = "Existing Topic" };
            _topicRepositoryMock.Setup(r => r.TopicNameExistsAsync("Existing Topic")).ReturnsAsync(true);

            // Act
            Func<Task> act = async () => await _topicService.CreateTopicAsync(createTopicDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Topic name already exists*");
        }

        [Fact]
        public async Task CreateTopicAsync_ShouldReturnTopicDto_WhenCreationSuccessful()
        {
            // Arrange
            var createTopicDto = new CreateUpdateTopicDto { TopicName = "  New Topic  " };
            var createdTopic = new Topic { Id = 1, TopicName = "New Topic" };
            _topicRepositoryMock.Setup(r => r.TopicNameExistsAsync("New Topic")).ReturnsAsync(false);
            _topicRepositoryMock.Setup(r => r.CreateTopicAsync(It.IsAny<Topic>())).ReturnsAsync(createdTopic);

            // Act
            var result = await _topicService.CreateTopicAsync(createTopicDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.TopicName.Should().Be("New Topic");
        }

        #endregion

        #region UpdateTopicAsync Tests

        [Fact]
        public async Task UpdateTopicAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Arrange
            var updateTopicDto = new CreateUpdateTopicDto { TopicName = "Updated Topic" };

            // Act
            Func<Task> act = async () => await _topicService.UpdateTopicAsync(0, updateTopicDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid topic ID*");
        }

        [Fact]
        public async Task UpdateTopicAsync_ShouldThrowArgumentNullException_WhenUpdateTopicDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _topicService.UpdateTopicAsync(1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("updateTopicDto");
        }

        [Fact]
        public async Task UpdateTopicAsync_ShouldThrowKeyNotFoundException_WhenTopicDoesNotExist()
        {
            // Arrange
            var updateTopicDto = new CreateUpdateTopicDto { TopicName = "Updated Topic" };
            _topicRepositoryMock.Setup(r => r.GetTopicByIdAsync(1)).ReturnsAsync((Topic)null!);

            // Act
            Func<Task> act = async () => await _topicService.UpdateTopicAsync(1, updateTopicDto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Topic with ID 1 not found");
        }

        [Fact]
        public async Task UpdateTopicAsync_ShouldThrowArgumentException_WhenTopicNameIsEmpty()
        {
            // Arrange
            var existingTopic = new Topic { Id = 1, TopicName = "Old Topic" };
            var updateTopicDto = new CreateUpdateTopicDto { TopicName = "" };
            _topicRepositoryMock.Setup(r => r.GetTopicByIdAsync(1)).ReturnsAsync(existingTopic);

            // Act
            Func<Task> act = async () => await _topicService.UpdateTopicAsync(1, updateTopicDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Topic name is required*");
        }

        [Fact]
        public async Task UpdateTopicAsync_ShouldReturnUpdatedTopicDto_WhenUpdateSuccessful()
        {
            // Arrange
            var existingTopic = new Topic { Id = 1, TopicName = "Old Topic" };
            var updateTopicDto = new CreateUpdateTopicDto { TopicName = "  Updated Topic  " };
            var updatedTopic = new Topic { Id = 1, TopicName = "Updated Topic" };
            _topicRepositoryMock.Setup(r => r.GetTopicByIdAsync(1)).ReturnsAsync(existingTopic);
            _topicRepositoryMock.Setup(r => r.UpdateTopicAsync(existingTopic)).ReturnsAsync(updatedTopic);

            // Act
            var result = await _topicService.UpdateTopicAsync(1, updateTopicDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.TopicName.Should().Be("Updated Topic");
        }

        #endregion

        #region DeleteTopicAsync Tests

        [Fact]
        public async Task DeleteTopicAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _topicService.DeleteTopicAsync(0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid topic ID*");
        }

        [Fact]
        public async Task DeleteTopicAsync_ShouldThrowKeyNotFoundException_WhenTopicDoesNotExist()
        {
            // Arrange
            _topicRepositoryMock.Setup(r => r.TopicExistsAsync(1)).ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _topicService.DeleteTopicAsync(1);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Topic with ID 1 not found");
        }

        [Fact]
        public async Task DeleteTopicAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            _topicRepositoryMock.Setup(r => r.TopicExistsAsync(1)).ReturnsAsync(true);
            _topicRepositoryMock.Setup(r => r.DeleteTopicAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _topicService.DeleteTopicAsync(1);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}