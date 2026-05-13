using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Implementations;
using FluentAssertions;
using Moq;
using Xunit;

namespace HireGate.Service.Tests
{
    public class QuestionServiceTests
    {
        private readonly Mock<IQuestionRepository> _questionRepositoryMock;
        private readonly QuestionService _questionService;

        public QuestionServiceTests()
        {
            _questionRepositoryMock = new Mock<IQuestionRepository>();
            _questionService = new QuestionService(_questionRepositoryMock.Object);
        }

        #region GetQuestionByIdAsync Tests

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _questionService.GetQuestionByIdAsync(0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnNull_WhenQuestionDoesNotExist()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync((Question)null!);

            // Act
            var result = await _questionService.GetQuestionByIdAsync(1);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnQuestionDto_WhenQuestionExists()
        {
            // Arrange
            var topic = new Topic { Id = 1, TopicName = "Test Topic" };
            var question = new Question
            {
                Id = 1,
                TopicId = 1,
                Topic = topic,
                QuestionText = "Test Question",
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            var result = await _questionService.GetQuestionByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.TopicId.Should().Be(1);
            result.TopicName.Should().Be("Test Topic");
            result.QuestionText.Should().Be("Test Question");
            result.Choices.Should().HaveCount(1);
        }

        #endregion

        #region GetAllQuestionsAsync Tests

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldReturnPagedQuestions()
        {
            // Arrange
            var topic = new Topic { Id = 1, TopicName = "Test Topic" };
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    TopicId = 1,
                    Topic = topic,
                    QuestionText = "Question 1",
                    Choices = new List<Choice> { new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true } }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetAllQuestionsAsync(1, 10)).ReturnsAsync((questions, 1));

            // Act
            var result = await _questionService.GetAllQuestionsAsync(1, 10);

            // Assert
            result.Items.Should().HaveCount(1);
            result.TotalCount.Should().Be(1);
            result.Items.First().Id.Should().Be(1);
            result.Items.First().DeletedAt.Should().BeNull();
        }

        #endregion

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldThrowArgumentException_WhenTopicIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _questionService.GetAllQuestionsAsync(1, 10, topicId: 0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid topic ID*");
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldReturnQuestionsForTopic()
        {
            // Arrange
            var topic = new Topic { Id = 1, TopicName = "Test Topic" };
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    TopicId = 1,
                    Topic = topic,
                    QuestionText = "Question 1",
                    Choices = new List<Choice> { new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true } }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetAllQuestionsAsync(1, 10, 1, null)).ReturnsAsync((questions, 1));

            // Act
            var (result, _) = await _questionService.GetAllQuestionsAsync(1, 10, topicId: 1);

            // Assert
            result.Should().HaveCount(1);
            result.First().Id.Should().Be(1);
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldPassDeletedFilterToRepository()
        {
            // Arrange
            _questionRepositoryMock
                .Setup(r => r.GetAllQuestionsAsync(1, 10, null, null, true))
                .ReturnsAsync((new List<Question>(), 0));

            // Act
            await _questionService.GetAllQuestionsAsync(1, 10, isDeleted: true);

            // Assert
            _questionRepositoryMock.Verify(r => r.GetAllQuestionsAsync(1, 10, null, null, true), Times.Once);
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnSoftDeleteFlag_WhenQuestionIsDeleted()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                TopicId = 1,
                QuestionText = "Deleted Question",
                DeletedAt = DateTime.UtcNow,
                Choices = new List<Choice>()
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            var result = await _questionService.GetQuestionByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.DeletedAt.Should().NotBeNull();
            result.DeletedAt.Should().NotBeNull();
        }

        #region CreateQuestionAsync Tests

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentNullException_WhenCreateQuestionDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("createQuestionDto");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenQuestionTextIsEmpty()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto { QuestionText = "", TopicId = 1, Choices = new List<CreateChoiceDto>() };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question text is required*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenTopicIdIsInvalid()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 0,
                Choices = new List<CreateChoiceDto> { new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true } }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Valid topic ID is required*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenChoicesIsNullOrEmpty()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto { QuestionText = "Test Question", TopicId = 1, Choices = null! };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("At least 2 choices are required*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenTooFewChoices()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                Choices = new List<CreateChoiceDto> { new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true } }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Number of choices must be between 2 and 4*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenTooManyChoices()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true },
                    new CreateChoiceDto { ChoiceText = "Choice 2", IsCorrect = false },
                    new CreateChoiceDto { ChoiceText = "Choice 3", IsCorrect = false },
                    new CreateChoiceDto { ChoiceText = "Choice 4", IsCorrect = false },
                    new CreateChoiceDto { ChoiceText = "Choice 5", IsCorrect = false }
                }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Number of choices must be between 2 and 4*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenChoiceTextIsEmpty()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true },
                    new CreateChoiceDto { ChoiceText = "", IsCorrect = false }
                }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Choice text is required for all choices*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenNoCorrectChoice()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = false },
                    new CreateChoiceDto { ChoiceText = "Choice 2", IsCorrect = false }
                }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Exactly one choice must be marked as correct*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenMultipleCorrectChoices()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true },
                    new CreateChoiceDto { ChoiceText = "Choice 2", IsCorrect = true }
                }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Exactly one choice must be marked as correct*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldThrowArgumentException_WhenQuestionImageIsInvalidUrl()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "Test Question",
                TopicId = 1,
                QuestionImage = "invalid-url",
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true },
                    new CreateChoiceDto { ChoiceText = "Choice 2", IsCorrect = false }
                }
            };

            // Act
            Func<Task> act = async () => await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question image must be a valid URL*");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldReturnQuestionDto_WhenCreationSuccessful()
        {
            // Arrange
            var createQuestionDto = new CreateQuestionDto
            {
                QuestionText = "  Test Question  ",
                TopicId = 1,
                QuestionImage = "https://example.com/image.jpg",
                Choices = new List<CreateChoiceDto>
                {
                    new CreateChoiceDto { ChoiceText = "  Choice 1  ", IsCorrect = true },
                    new CreateChoiceDto { ChoiceText = "  Choice 2  ", IsCorrect = false }
                }
            };
            var createdQuestion = new Question
            {
                Id = 1,
                TopicId = 1,
                QuestionText = "Test Question",
                QuestionImage = "https://example.com/image.jpg",
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.CreateQuestionAsync(It.IsAny<Question>())).ReturnsAsync(createdQuestion);

            // Act
            var result = await _questionService.CreateQuestionAsync(createQuestionDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionText.Should().Be("Test Question");
            result.QuestionImage.Should().Be("https://example.com/image.jpg");
            result.Choices.Should().HaveCount(2);
            result.Choices.First().ChoiceText.Should().Be("Choice 1");
            result.Choices.First().IsCorrect.Should().BeTrue();
        }

        #endregion

        #region UpdateQuestionAsync Tests

        [Fact]
        public async Task UpdateQuestionAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Arrange
            var updateQuestionDto = new UpdateQuestionDto { QuestionText = "Updated Question", TopicId = 1, Choices = new List<UpdateChoiceDto>() };

            // Act
            Func<Task> act = async () => await _questionService.UpdateQuestionAsync(0, updateQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task UpdateQuestionAsync_ShouldThrowArgumentNullException_WhenUpdateQuestionDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _questionService.UpdateQuestionAsync(1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("updateQuestionDto");
        }

        [Fact]
        public async Task UpdateQuestionAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            var updateQuestionDto = new UpdateQuestionDto
            {
                QuestionText = "Updated Question",
                TopicId = 1,
                Choices = new List<UpdateChoiceDto> { new UpdateChoiceDto { ChoiceText = "Choice 1", IsCorrect = true } }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync((Question)null!);

            // Act
            Func<Task> act = async () => await _questionService.UpdateQuestionAsync(1, updateQuestionDto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task UpdateQuestionAsync_ShouldReturnUpdatedQuestionDto_WhenUpdateSuccessful()
        {
            // Arrange
            var existingQuestion = new Question { Id = 1, TopicId = 1, QuestionText = "Old Question", Choices = new List<Choice>() };
            var updateQuestionDto = new UpdateQuestionDto
            {
                QuestionText = "  Updated Question  ",
                TopicId = 2,
                Choices = new List<UpdateChoiceDto>
                {
                    new UpdateChoiceDto { ChoiceText = "  Choice 1  ", IsCorrect = true },
                    new UpdateChoiceDto { ChoiceText = "  Choice 2  ", IsCorrect = false }
                }
            };
            var updatedQuestion = new Question
            {
                Id = 1,
                TopicId = 2,
                QuestionText = "Updated Question",
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(existingQuestion);
            _questionRepositoryMock.Setup(r => r.UpdateQuestionAsync(existingQuestion)).ReturnsAsync(updatedQuestion);

            // Act
            var result = await _questionService.UpdateQuestionAsync(1, updateQuestionDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionText.Should().Be("Updated Question");
            result.Choices.Should().HaveCount(2);
        }

        #endregion

        #region PatchQuestionAsync Tests

        [Fact]
        public async Task PatchQuestionAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Arrange
            var patchQuestionDto = new PatchQuestionDto { QuestionText = "Patched Question" };

            // Act
            Func<Task> act = async () => await _questionService.PatchQuestionAsync(0, patchQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task PatchQuestionAsync_ShouldThrowArgumentNullException_WhenPatchQuestionDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _questionService.PatchQuestionAsync(1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("patchQuestionDto");
        }

        [Fact]
        public async Task PatchQuestionAsync_ShouldThrowArgumentException_WhenTopicIdIsInvalid()
        {
            // Arrange
            var existingQuestion = new Question { Id = 1, TopicId = 1, QuestionText = "Old Question", Choices = new List<Choice>() };
            var patchQuestionDto = new PatchQuestionDto { TopicId = 0 };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(existingQuestion);

            // Act
            Func<Task> act = async () => await _questionService.PatchQuestionAsync(1, patchQuestionDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Valid topic ID is required*");
        }

        [Fact]
        public async Task PatchQuestionAsync_ShouldReturnPatchedQuestionDto_WhenPatchSuccessful()
        {
            // Arrange
            var existingQuestion = new Question { Id = 1, TopicId = 1, QuestionText = "Old Question", Choices = new List<Choice>() };
            var patchQuestionDto = new PatchQuestionDto
            {
                QuestionText = "  Patched Question  ",
                TopicId = 2,
                Choices = new List<PatchChoiceDto>
                {
                    new PatchChoiceDto { ChoiceText = "  Choice 1  ", IsCorrect = true },
                    new PatchChoiceDto { ChoiceText = "  Choice 2  ", IsCorrect = false }
                }
            };
            var patchedQuestion = new Question
            {
                Id = 1,
                TopicId = 2,
                QuestionText = "Patched Question",
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(existingQuestion);
            _questionRepositoryMock.Setup(r => r.UpdateQuestionAsync(existingQuestion)).ReturnsAsync(patchedQuestion);

            // Act
            var result = await _questionService.PatchQuestionAsync(1, patchQuestionDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionText.Should().Be("Patched Question");
            result.Choices.Should().HaveCount(2);
        }

        #endregion

        #region DeleteQuestionAsync Tests

        [Fact]
        public async Task DeleteQuestionAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _questionService.DeleteQuestionAsync(0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task DeleteQuestionAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _questionService.DeleteQuestionAsync(1);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task DeleteQuestionAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(true);
            _questionRepositoryMock.Setup(r => r.DeleteQuestionAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _questionService.DeleteQuestionAsync(1);

            // Assert
            result.Should().BeTrue();
        }

        #endregion

        #region RestoreQuestionAsync Tests

        [Fact]
        public async Task RestoreQuestionAsync_ShouldThrowArgumentException_WhenIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _questionService.RestoreQuestionAsync(0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task RestoreQuestionAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _questionService.RestoreQuestionAsync(1);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task RestoreQuestionAsync_ShouldThrowInvalidOperationException_WhenQuestionIsNotDeleted()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(true);
            _questionRepositoryMock.Setup(r => r.RestoreQuestionAsync(1)).ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _questionService.RestoreQuestionAsync(1);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Question with ID 1 is not deleted");
        }

        [Fact]
        public async Task RestoreQuestionAsync_ShouldReturnTrue_WhenRestoreSuccessful()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(true);
            _questionRepositoryMock.Setup(r => r.RestoreQuestionAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _questionService.RestoreQuestionAsync(1);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}