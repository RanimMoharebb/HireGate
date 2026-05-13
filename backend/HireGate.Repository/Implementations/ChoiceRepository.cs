using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{
    public class ChoiceRepository : IChoiceRepository
    {
        private readonly AppDbContext _context;

        public ChoiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Choice>> GetChoicesByQuestionIdAsync(int questionId)
        {
            return await _context.Choices
                .AsNoTracking()
                .Where(c => c.QuestionId == questionId)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<Choice> CreateChoiceAsync(Choice choice)
        {
            _context.Choices.Add(choice);
            await _context.SaveChangesAsync();
            return choice;
        }

        public async Task<Choice> UpdateChoiceAsync(Choice choice)
        {
            _context.Choices.Update(choice);
            await _context.SaveChangesAsync();
            return choice;
        }

        public async Task<bool> DeleteChoiceAsync(Choice choice)
        {
            _context.Choices.Remove(choice);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
