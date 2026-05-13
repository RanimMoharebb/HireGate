using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface IChoiceRepository
    {
        Task<IReadOnlyList<Choice>> GetChoicesByQuestionIdAsync(int questionId);
        Task<Choice> CreateChoiceAsync(Choice choice);
        Task<Choice> UpdateChoiceAsync(Choice choice);
        Task<bool> DeleteChoiceAsync(Choice choice);
    }
}
