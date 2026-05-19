using HireGate.Data.Models;
using HireGate.Service.DTOs;

namespace HireGate.Service.Mappers
{
    public static class ChoiceMapper
    {
        public static ChoiceDto ToDto(Choice choice)
        {
            return new ChoiceDto
            {
                Id = choice.Id,
                QuestionId = choice.QuestionId,
                ChoiceText = choice.ChoiceText,
                IsCorrect = choice.IsCorrect
            };
        }

        public static Choice FromCreateDto(CreateChoiceDto dto)
        {
            return new Choice
            {
                QuestionId = dto.QuestionId,
                ChoiceText = dto.ChoiceText.Trim(),
                IsCorrect = dto.IsCorrect
            };
        }

        public static void ApplyUpdate(Choice target, UpdateChoiceDto dto)
        {
            target.ChoiceText = dto.ChoiceText.Trim();
            target.IsCorrect = dto.IsCorrect;
        }

        public static void ApplyPatch(Choice target, PatchChoiceDto patch)
        {
            if (patch.ChoiceText != null)
                target.ChoiceText = patch.ChoiceText.Trim();

            if (patch.IsCorrect.HasValue)
                target.IsCorrect = patch.IsCorrect.Value;
        }
    }
}
