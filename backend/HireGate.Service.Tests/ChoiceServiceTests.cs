using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Implementations;
using FluentAssertions;
using Moq;
using Xunit;

namespace HireGate.Service.Tests
{
    public class ChoiceServiceTests
    {
        private readonly Mock<IChoiceRepository> _choiceRepositoryMock;
        private readonly Mock<IQuestionRepository> _questionRepositoryMock;
        private readonly ChoiceService _choiceService;

        public ChoiceServiceTests()
        {
            _choiceRepositoryMock = new Mock<IChoiceRepository>();
            _questionRepositoryMock = new Mock<IQuestionRepository>();
            _choiceService = new ChoiceService(_choiceRepositoryMock.Object, _questionRepositoryMock.Object);
        }

        #region GetChoicesForQuestionAsync Tests

        [Fact]
        public async Task GetChoicesForQuestionAsync_ShouldThrowArgumentException_WhenQuestionIdIsInvalid()
        {
            Func<Task> act = async () => await _choiceService.GetChoicesForQuestionAsync(0);

            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task GetChoicesForQuestionAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(false);

            Func<Task> act = async () => await _choiceService.GetChoicesForQuestionAsync(1);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task GetChoicesForQuestionAsync_ShouldReturnMappedChoiceDtos_FromRepository()
        {
            var choicesFromRepo = new List<Choice>
            {
                new Choice { Id = 1, QuestionId = 1, ChoiceText = "First", IsCorrect = true },
                new Choice { Id = 2, QuestionId = 1, ChoiceText = "Second", IsCorrect = false },
                new Choice { Id = 3, QuestionId = 1, ChoiceText = "Third", IsCorrect = false }
            };
            _questionRepositoryMock.Setup(r => r.QuestionExistsAsync(1)).ReturnsAsync(true);
            _choiceRepositoryMock.Setup(r => r.GetChoicesByQuestionIdAsync(1)).ReturnsAsync(choicesFromRepo);

            var result = await _choiceService.GetChoicesForQuestionAsync(1);

            result.Should().HaveCount(3);
            result.Select(c => c.Id).Should().ContainInOrder(1, 2, 3);
            result[0].ChoiceText.Should().Be("First");
            result[0].IsCorrect.Should().BeTrue();
        }

        #endregion

        #region AddChoiceAsync Tests

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentException_WhenQuestionIdIsInvalid()
        {
            // Arrange
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "Test Choice", IsCorrect = false };

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(0, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentNullException_WhenCreateChoiceDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("createChoiceDto");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentException_WhenChoiceTextIsEmpty()
        {
            // Arrange
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "", IsCorrect = false };

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Choice text is required*");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "Test Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync((Question)null!);

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentException_WhenQuestionHasMaxChoices()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = false },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = true },
                    new Choice { Id = 3, ChoiceText = "Choice 3", IsCorrect = false },
                    new Choice { Id = 4, ChoiceText = "Choice 4", IsCorrect = false }
                }
            };
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "Test Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question cannot have more than 4 choices");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentException_WhenAddingSecondCorrectChoice()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true }
                }
            };
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "Test Choice", IsCorrect = true };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question already has a correct choice");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldThrowArgumentException_WhenAddingIncorrectChoiceWithoutExistingCorrect()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>()
            };
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "Test Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question must have exactly one correct choice");
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldReturnChoiceDto_WhenAddingCorrectChoiceSuccessfully()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>()
            };
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "  Test Choice  ", IsCorrect = true };
            var createdChoice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Test Choice", IsCorrect = true };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
            _choiceRepositoryMock.Setup(r => r.CreateChoiceAsync(It.IsAny<Choice>())).ReturnsAsync(createdChoice);

            // Act
            var result = await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionId.Should().Be(1);
            result.ChoiceText.Should().Be("Test Choice");
            result.IsCorrect.Should().BeTrue();
        }

        [Fact]
        public async Task AddChoiceAsync_ShouldReturnChoiceDto_WhenAddingIncorrectChoiceSuccessfully()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Existing Correct", IsCorrect = true }
                }
            };
            var createChoiceDto = new CreateChoiceDto { ChoiceText = "  Test Choice  ", IsCorrect = false };
            var createdChoice = new Choice { Id = 2, QuestionId = 1, ChoiceText = "Test Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
            _choiceRepositoryMock.Setup(r => r.CreateChoiceAsync(It.IsAny<Choice>())).ReturnsAsync(createdChoice);

            // Act
            var result = await _choiceService.AddChoiceAsync(1, createChoiceDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(2);
            result.QuestionId.Should().Be(1);
            result.ChoiceText.Should().Be("Test Choice");
            result.IsCorrect.Should().BeFalse();
        }

        #endregion

        #region UpdateChoiceAsync Tests

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentException_WhenQuestionIdIsInvalid()
        {
            // Arrange
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = false };

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(0, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentException_WhenChoiceIdIsInvalid()
        {
            // Arrange
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = false };

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 0, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid choice ID*");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentNullException_WhenUpdateChoiceDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("updateChoiceDto");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentException_WhenChoiceTextIsEmpty()
        {
            // Arrange
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "", IsCorrect = false };

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Choice text is required*");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync((Question)null!);

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowKeyNotFoundException_WhenChoiceDoesNotExist()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = true }
                }
            };
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Choice with ID 1 not found in question 1");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentException_WhenMarkingAsCorrectWithExistingCorrect()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = false },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = true }
                }
            };
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = true };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question already has a correct choice");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldThrowArgumentException_WhenUnmarkingOnlyCorrectChoice()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false }
                }
            };
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "Updated Choice", IsCorrect = false };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question must have exactly one correct choice");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldReturnUpdatedChoiceDto_WhenUpdateSuccessful()
        {
            // Arrange
            var choice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Old Choice", IsCorrect = false };
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice> { choice }
            };
            var updateChoiceDto = new UpdateChoiceDto { ChoiceText = "  Updated Choice  ", IsCorrect = true };
            var updatedChoice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Updated Choice", IsCorrect = true };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
            _choiceRepositoryMock.Setup(r => r.UpdateChoiceAsync(choice)).ReturnsAsync(updatedChoice);

            // Act
            var result = await _choiceService.UpdateChoiceAsync(1, 1, updateChoiceDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionId.Should().Be(1);
            result.ChoiceText.Should().Be("Updated Choice");
            result.IsCorrect.Should().BeTrue();
        }

        #endregion

        #region PatchChoiceAsync Tests

        [Fact]
        public async Task PatchChoiceAsync_ShouldThrowArgumentException_WhenQuestionIdIsInvalid()
        {
            // Arrange
            var patchChoiceDto = new PatchChoiceDto { ChoiceText = "Patched Choice" };

            // Act
            Func<Task> act = async () => await _choiceService.PatchChoiceAsync(0, 1, patchChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task PatchChoiceAsync_ShouldThrowArgumentException_WhenChoiceIdIsInvalid()
        {
            // Arrange
            var patchChoiceDto = new PatchChoiceDto { ChoiceText = "Patched Choice" };

            // Act
            Func<Task> act = async () => await _choiceService.PatchChoiceAsync(1, 0, patchChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid choice ID*");
        }

        [Fact]
        public async Task PatchChoiceAsync_ShouldThrowArgumentNullException_WhenPatchChoiceDtoIsNull()
        {
            // Act
            Func<Task> act = async () => await _choiceService.PatchChoiceAsync(1, 1, null!);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithParameterName("patchChoiceDto");
        }

        [Fact]
        public async Task PatchChoiceAsync_ShouldThrowArgumentException_WhenChoiceTextIsEmpty()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true }
                }
            };
            var patchChoiceDto = new PatchChoiceDto { ChoiceText = "" };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.PatchChoiceAsync(1, 1, patchChoiceDto);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Choice text cannot be empty*");
        }

        [Fact]
        public async Task PatchChoiceAsync_ShouldReturnPatchedChoiceDto_WhenPatchSuccessful()
        {
            // Arrange
            var choice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Old Choice", IsCorrect = false };
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice> { choice }
            };
            var patchChoiceDto = new PatchChoiceDto { ChoiceText = "  Patched Choice  ", IsCorrect = true };
            var patchedChoice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Patched Choice", IsCorrect = true };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
            _choiceRepositoryMock.Setup(r => r.UpdateChoiceAsync(choice)).ReturnsAsync(patchedChoice);

            // Act
            var result = await _choiceService.PatchChoiceAsync(1, 1, patchChoiceDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.QuestionId.Should().Be(1);
            result.ChoiceText.Should().Be("Patched Choice");
            result.IsCorrect.Should().BeTrue();
        }

        #endregion

        #region DeleteChoiceAsync Tests

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowArgumentException_WhenQuestionIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(0, 1);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID*");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowArgumentException_WhenChoiceIdIsInvalid()
        {
            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(1, 0);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid choice ID*");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowKeyNotFoundException_WhenQuestionDoesNotExist()
        {
            // Arrange
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync((Question)null!);

            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(1, 1);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Question with ID 1 not found");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowKeyNotFoundException_WhenChoiceDoesNotExist()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = true }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(1, 1);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Choice with ID 1 not found in question 1");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowArgumentException_WhenDeletingWouldLeaveTooFewChoices()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(1, 1);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question must have at least 2 choices");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldThrowArgumentException_WhenDeletingOnlyCorrectChoice()
        {
            // Arrange
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    new Choice { Id = 1, ChoiceText = "Choice 1", IsCorrect = true },
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = false },
                    new Choice { Id = 3, ChoiceText = "Choice 3", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

            // Act
            Func<Task> act = async () => await _choiceService.DeleteChoiceAsync(1, 1);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Question must have at least one correct choice");
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var choice = new Choice { Id = 1, QuestionId = 1, ChoiceText = "Choice 1", IsCorrect = false };
            var question = new Question
            {
                Id = 1,
                Choices = new List<Choice>
                {
                    choice,
                    new Choice { Id = 2, ChoiceText = "Choice 2", IsCorrect = true },
                    new Choice { Id = 3, ChoiceText = "Choice 3", IsCorrect = false }
                }
            };
            _questionRepositoryMock.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
            _choiceRepositoryMock.Setup(r => r.DeleteChoiceAsync(choice)).ReturnsAsync(true);

            // Act
            var result = await _choiceService.DeleteChoiceAsync(1, 1);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}