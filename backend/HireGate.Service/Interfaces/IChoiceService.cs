using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface IChoiceService
    {
        Task<ChoiceDto> AddChoiceAsync(int questionId, CreateChoiceDto createChoiceDto);
        Task<ChoiceDto> UpdateChoiceAsync(int questionId, int choiceId, UpdateChoiceDto updateChoiceDto);
        Task<ChoiceDto> PatchChoiceAsync(int questionId, int choiceId, PatchChoiceDto patchChoiceDto);
        Task<bool> DeleteChoiceAsync(int questionId, int choiceId);
    }
}
