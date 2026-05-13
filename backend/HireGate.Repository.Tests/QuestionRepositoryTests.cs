using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Implementations;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace HireGate.Repository.Tests
{
    public class QuestionRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly QuestionRepository _repository;

        public QuestionRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new QuestionRepository(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnQuestionWithIncludes_WhenExists()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Test Question",
                Choices = new List<Choice>
                {
                    new Choice { ChoiceText = "Choice 1", IsCorrect = true }
                }
            };
            topic.Questions.Add(question);
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetQuestionByIdAsync(question.Id);

            // Assert
            result.Should().NotBeNull();
            result!.QuestionText.Should().Be("Test Question");
            result.Topic.Should().NotBeNull();
            result.Topic!.TopicName.Should().Be("Test Topic");
            result.Choices.Should().HaveCount(1);
            result.Choices.First().ChoiceText.Should().Be("Choice 1");
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetQuestionByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetQuestionByIdAsync_ShouldReturnQuestion_WhenSoftDeleted()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Deleted Question",
                DeletedAt = DateTime.UtcNow,
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetQuestionByIdAsync(question.Id);

            // Assert
            result.Should().NotBeNull();
            result!.DeletedAt.Should().NotBeNull();
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldReturnPagedQuestionsWithIncludes()
        {
            // Arrange
            var topic = new Topic { TopicName = "Test Topic" };
            var questions = new List<Question>
            {
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Question 1",
                    Choices = new List<Choice> { new Choice { ChoiceText = "Choice 1", IsCorrect = true } }
                },
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Question 2",
                    Choices = new List<Choice> { new Choice { ChoiceText = "Choice 2", IsCorrect = true } }
                },
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Question 3",
                    Choices = new List<Choice> { new Choice { ChoiceText = "Choice 3", IsCorrect = true } }
                }
            };
            topic.Questions.Add(questions[0]);
            topic.Questions.Add(questions[1]);
            topic.Questions.Add(questions[2]);
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllQuestionsAsync(1, 2);

            // Assert
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(3);
            result.Items.First().QuestionText.Should().Be("Question 1");
            result.Items.Last().QuestionText.Should().Be("Question 2");
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldExcludeSoftDeletedQuestions()
        {
            // Arrange
            _context.Questions.AddRange(
                new Question { TopicId = 1, QuestionText = "Active Question", Choices = new List<Choice>() },
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Deleted Question",
                    DeletedAt = DateTime.UtcNow,
                    Choices = new List<Choice>()
                });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllQuestionsAsync(1, 10);

            // Assert
            result.TotalCount.Should().Be(1);
            result.Items.Should().ContainSingle(q => q.QuestionText == "Active Question");
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldReturnOnlyDeleted_WhenDeletedFilterTrue()
        {
            // Arrange
            _context.Questions.AddRange(
                new Question { TopicId = 1, QuestionText = "Active Question", Choices = new List<Choice>() },
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Deleted Question",
                    DeletedAt = DateTime.UtcNow,
                    Choices = new List<Choice>()
                });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllQuestionsAsync(1, 10, null, null, true);

            // Assert
            result.TotalCount.Should().Be(1);
            result.Items.Should().ContainSingle(q => q.QuestionText == "Deleted Question");
        }

        [Fact]
        public async Task GetAllQuestionsAsync_ShouldReturnAll_WhenDeletedFilterNull()
        {
            // Arrange
            _context.Questions.AddRange(
                new Question { TopicId = 1, QuestionText = "Active Question", Choices = new List<Choice>() },
                new Question
                {
                    TopicId = 1,
                    QuestionText = "Deleted Question",
                    DeletedAt = DateTime.UtcNow,
                    Choices = new List<Choice>()
                });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllQuestionsAsync(1, 10, null, null, null);

            // Assert
            result.TotalCount.Should().Be(2);
            result.Items.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetQuestionsByTopicIdAsync_ShouldReturnQuestionsForTopic()
        {
            // Arrange
            var topic1 = new Topic { TopicName = "Topic 1" };
            var topic2 = new Topic { TopicName = "Topic 2" };
            var question1 = new Question
            {
                TopicId = 1,
                QuestionText = "Question 1",
                Choices = new List<Choice> { new Choice { ChoiceText = "Choice 1", IsCorrect = true } }
            };
            var question2 = new Question
            {
                TopicId = 2,
                QuestionText = "Question 2",
                Choices = new List<Choice> { new Choice { ChoiceText = "Choice 2", IsCorrect = true } }
            };
            topic1.Questions.Add(question1);
            topic2.Questions.Add(question2);
            _context.Topics.AddRange(topic1, topic2);
            await _context.SaveChangesAsync();

            // Act
            var (result, _) = await _repository.GetAllQuestionsAsync(1, 100, topicId: 1);

            // Assert
            result.Should().HaveCount(1);
            result.First().QuestionText.Should().Be("Question 1");
            result.First().Topic.Should().NotBeNull();
            result.First().Topic!.TopicName.Should().Be("Topic 1");
        }

        [Fact]
        public async Task CreateQuestionAsync_ShouldAddQuestionToDatabase()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "New Question",
                Choices = new List<Choice>
                {
                    new Choice { ChoiceText = "Choice 1", IsCorrect = true }
                }
            };

            // Act
            var result = await _repository.CreateQuestionAsync(question);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.QuestionText.Should().Be("New Question");

            var savedQuestion = await _context.Questions.FindAsync(result.Id);
            savedQuestion.Should().NotBeNull();
            savedQuestion!.QuestionText.Should().Be("New Question");
        }

        [Fact]
        public async Task UpdateQuestionAsync_ShouldUpdateQuestionInDatabase()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Original Question",
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            question.QuestionText = "Updated Question";

            // Act
            var result = await _repository.UpdateQuestionAsync(question);

            // Assert
            result.Should().NotBeNull();
            result.QuestionText.Should().Be("Updated Question");

            var updatedQuestion = await _context.Questions.FindAsync(question.Id);
            updatedQuestion.Should().NotBeNull();
            updatedQuestion!.QuestionText.Should().Be("Updated Question");
        }

        [Fact]
        public async Task DeleteQuestionAsync_ShouldSetDeletedAt_WhenQuestionExists()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Test Question",
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.DeleteQuestionAsync(question.Id);

            // Assert
            result.Should().BeTrue();

            var deletedQuestion = await _context.Questions.FindAsync(question.Id);
            deletedQuestion.Should().NotBeNull();
            deletedQuestion!.DeletedAt.Should().NotBeNull();
        }

        [Fact]
        public async Task DeleteQuestionAsync_ShouldReturnFalse_WhenQuestionNotExists()
        {
            // Act
            var result = await _repository.DeleteQuestionAsync(999);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task RestoreQuestionAsync_ShouldClearDeletedAt_WhenQuestionIsSoftDeleted()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Soft Deleted Question",
                DeletedAt = DateTime.UtcNow,
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.RestoreQuestionAsync(question.Id);

            // Assert
            result.Should().BeTrue();
            var restoredQuestion = await _context.Questions.FindAsync(question.Id);
            restoredQuestion.Should().NotBeNull();
            restoredQuestion!.DeletedAt.Should().BeNull();
        }

        [Fact]
        public async Task RestoreQuestionAsync_ShouldReturnFalse_WhenQuestionNotSoftDeleted()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Active Question",
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.RestoreQuestionAsync(question.Id);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task QuestionExistsAsync_ShouldReturnTrue_WhenExists()
        {
            // Arrange
            var question = new Question
            {
                TopicId = 1,
                QuestionText = "Test Question",
                Choices = new List<Choice>()
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.QuestionExistsAsync(question.Id);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task QuestionExistsAsync_ShouldReturnFalse_WhenNotExists()
        {
            // Act
            var result = await _repository.QuestionExistsAsync(999);

            // Assert
            result.Should().BeFalse();
        }
    }
}