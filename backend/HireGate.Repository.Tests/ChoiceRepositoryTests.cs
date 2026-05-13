using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Implementations;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace HireGate.Repository.Tests
{
    public class ChoiceRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly ChoiceRepository _repository;

        public ChoiceRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new ChoiceRepository(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetChoicesByQuestionIdAsync_ShouldReturnChoicesForQuestion_OrderedById()
        {
            _context.Choices.AddRange(
                new Choice { QuestionId = 1, ChoiceText = "B", IsCorrect = false },
                new Choice { QuestionId = 2, ChoiceText = "Other Q", IsCorrect = true },
                new Choice { QuestionId = 1, ChoiceText = "A", IsCorrect = true }
            );
            await _context.SaveChangesAsync();

            var result = await _repository.GetChoicesByQuestionIdAsync(1);

            result.Should().HaveCount(2);
            result.Select(c => c.ChoiceText).Should().ContainInOrder("B", "A");
        }

        [Fact]
        public async Task CreateChoiceAsync_ShouldAddChoiceToDatabase()
        {
            // Arrange
            var choice = new Choice
            {
                QuestionId = 1,
                ChoiceText = "Test Choice",
                IsCorrect = true
            };

            // Act
            var result = await _repository.CreateChoiceAsync(choice);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.ChoiceText.Should().Be("Test Choice");
            result.IsCorrect.Should().BeTrue();

            var savedChoice = await _context.Choices.FindAsync(result.Id);
            savedChoice.Should().NotBeNull();
            savedChoice!.ChoiceText.Should().Be("Test Choice");
        }

        [Fact]
        public async Task UpdateChoiceAsync_ShouldUpdateChoiceInDatabase()
        {
            // Arrange
            var choice = new Choice
            {
                QuestionId = 1,
                ChoiceText = "Original Choice",
                IsCorrect = false
            };
            _context.Choices.Add(choice);
            await _context.SaveChangesAsync();

            choice.ChoiceText = "Updated Choice";
            choice.IsCorrect = true;

            // Act
            var result = await _repository.UpdateChoiceAsync(choice);

            // Assert
            result.Should().NotBeNull();
            result.ChoiceText.Should().Be("Updated Choice");
            result.IsCorrect.Should().BeTrue();

            var updatedChoice = await _context.Choices.FindAsync(choice.Id);
            updatedChoice.Should().NotBeNull();
            updatedChoice!.ChoiceText.Should().Be("Updated Choice");
            updatedChoice.IsCorrect.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteChoiceAsync_ShouldRemoveChoiceFromDatabase()
        {
            // Arrange
            var choice = new Choice
            {
                QuestionId = 1,
                ChoiceText = "Test Choice",
                IsCorrect = true
            };
            _context.Choices.Add(choice);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.DeleteChoiceAsync(choice);

            // Assert
            result.Should().BeTrue();

            var deletedChoice = await _context.Choices.FindAsync(choice.Id);
            deletedChoice.Should().BeNull();
        }
    }
}