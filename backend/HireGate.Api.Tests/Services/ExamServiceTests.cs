using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Implementations;
using FluentAssertions;
using Moq;

namespace HireGate.Api.Tests.Services
{
    public class ExamServiceTests
    {
        private readonly Mock<IExamRepository> _examRepositoryMock;
        private readonly Mock<IQuestionRepository> _questionRepositoryMock;
        private readonly ExamService _examService;

        public ExamServiceTests()
        {
            _examRepositoryMock = new Mock<IExamRepository>();
            _questionRepositoryMock = new Mock<IQuestionRepository>();
            _examService = new ExamService(_examRepositoryMock.Object, _questionRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAllExamsAsync_ShouldReturnAllExamsAsDtos()
        {
            // Arrange
            var exams = new List<Exam>
            {
                new Exam { Id = 1, PositionTitle = "Developer", DurationMinutes = 60 },
                new Exam { Id = 2, PositionTitle = "Manager", DurationMinutes = 90 }
            };
            _examRepositoryMock
                .Setup(r => r.GetAllExamsAsync(1, 10, null))
                .ReturnsAsync((exams, exams.Count));

            // Act
            var (result, totalCount) = await _examService.GetAllExamsAsync(1, 10, null);

            // Assert
            result.Should().HaveCount(2);
            totalCount.Should().Be(2);
            result.First().Id.Should().Be(1);
            result.First().PositionTitle.Should().Be("Developer");
            result.Last().PositionTitle.Should().Be("Manager");
        }

        [Fact]
        public async Task GetExamByIdAsync_ShouldReturnExamDto_WhenExamExists()
        {
            // Arrange
            var exam = new Exam { Id = 1, PositionTitle = "Developer", DurationMinutes = 60 };
            _examRepositoryMock.Setup(r => r.GetExamByIdAsync(1)).ReturnsAsync(exam);

            // Act
            var result = await _examService.GetExamByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.PositionTitle.Should().Be("Developer");
            result.DurationMinutes.Should().Be(60);
        }

        [Fact]
        public async Task GetExamByIdAsync_ShouldReturnNull_WhenExamDoesNotExist()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.GetExamByIdAsync(1)).ReturnsAsync((Exam?)null);

            // Act
            var result = await _examService.GetExamByIdAsync(1);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task UpdateExamAsync_ShouldReturnNull_WhenExamDoesNotExist()
        {
            // Arrange
            var updateDto = new UpdateExamDto { PositionTitle = "Updated" };
            _examRepositoryMock.Setup(r => r.GetExamByIdForUpdateAsync(1)).ReturnsAsync((Exam?)null);

            // Act
            var result = await _examService.UpdateExamAsync(1, updateDto);

            // Assert
            result.Should().BeNull();
            _examRepositoryMock.Verify(r => r.UpdateExam(It.IsAny<Exam>()), Times.Never);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteExamAsync_ShouldReturnTrue_WhenExamExists()
        {
            // Arrange
            var exam = new Exam { Id = 1, PositionTitle = "Test" };
            _examRepositoryMock.Setup(r => r.GetExamByIdAsync(1)).ReturnsAsync(exam);

            // Act
            var result = await _examService.DeleteExamAsync(1);

            // Assert
            result.Should().BeTrue();
            _examRepositoryMock.Verify(r => r.DeleteExam(exam), Times.Once);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteExamAsync_ShouldReturnFalse_WhenExamDoesNotExist()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.GetExamByIdAsync(1)).ReturnsAsync((Exam?)null);

            // Act
            var result = await _examService.DeleteExamAsync(1);

            // Assert
            result.Should().BeFalse();
            _examRepositoryMock.Verify(r => r.DeleteExam(It.IsAny<Exam>()), Times.Never);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }

        [Fact]
        public async Task GetExamQuestionsAsync_ShouldReturnQuestions()
        {
            // Arrange
            var questions = new List<Question>
            {
                new Question { Id = 1, QuestionText = "Question 1" },
                new Question { Id = 2, QuestionText = "Question 2" }
            };
            _examRepositoryMock.Setup(r => r.GetQuestionsAsync(1)).ReturnsAsync(questions);

            // Act
            var result = await _examService.GetExamQuestionsAsync(1);

            // Assert
            result.Should().HaveCount(2);
            result.First().QuestionText.Should().Be("Question 1");
        }


        [Fact]
        public async Task AddQuestionToExamAsync_ShouldReturnFalse_WhenExamDoesNotExist()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.ExamExistsAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _examService.AddQuestionToExamAsync(1, 1);

            // Assert
            result.Should().BeFalse();
            _examRepositoryMock.Verify(r => r.AddQuestionAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }

        [Fact]
        public async Task AddQuestionToExamAsync_ShouldReturnFalse_WhenQuestionAlreadyInExam()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.ExamExistsAsync(1)).ReturnsAsync(true);
            _examRepositoryMock.Setup(r => r.QuestionAlreadyInExamAsync(1, 1)).ReturnsAsync(true);

            // Act
            var result = await _examService.AddQuestionToExamAsync(1, 1);

            // Assert
            result.Should().BeFalse();
            _examRepositoryMock.Verify(r => r.AddQuestionAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }

        [Fact]
        public async Task RemoveQuestionFromExamAsync_ShouldReturnTrue_WhenExamExistsAndQuestionRemoved()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.ExamExistsAsync(1)).ReturnsAsync(true);
            _examRepositoryMock.Setup(r => r.RemoveQuestionAsync(1, 1)).ReturnsAsync(true);

            // Act
            var result = await _examService.RemoveQuestionFromExamAsync(1, 1);

            // Assert
            result.Should().BeTrue();
            _examRepositoryMock.Verify(r => r.RemoveQuestionAsync(1, 1), Times.Once);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task RemoveQuestionFromExamAsync_ShouldReturnFalse_WhenExamDoesNotExist()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.ExamExistsAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _examService.RemoveQuestionFromExamAsync(1, 1);

            // Assert
            result.Should().BeFalse();
            _examRepositoryMock.Verify(r => r.RemoveQuestionAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }

        [Fact]
        public async Task RemoveQuestionFromExamAsync_ShouldReturnFalse_WhenQuestionNotInExam()
        {
            // Arrange
            _examRepositoryMock.Setup(r => r.ExamExistsAsync(1)).ReturnsAsync(true);
            _examRepositoryMock.Setup(r => r.RemoveQuestionAsync(1, 1)).ReturnsAsync(false);

            // Act
            var result = await _examService.RemoveQuestionFromExamAsync(1, 1);

            // Assert
            result.Should().BeFalse();
            _examRepositoryMock.Verify(r => r.RemoveQuestionAsync(1, 1), Times.Once);
            _examRepositoryMock.Verify(r => r.SaveAsync(), Times.Never);
        }
    }
}
