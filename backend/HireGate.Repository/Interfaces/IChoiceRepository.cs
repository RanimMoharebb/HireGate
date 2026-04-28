using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{
    public interface IChoiceRepository
    {
        Task<Choice> CreateChoiceAsync(Choice choice);
        Task<Choice> UpdateChoiceAsync(Choice choice);
        Task<bool> DeleteChoiceAsync(Choice choice);
    }
}
