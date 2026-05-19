using HireGate.Data.Models;
using HireGate.Service.DTOs;
using System.Linq;

namespace HireGate.Service.Mappers
{
    public static class QuestionMapper
    {
        public static QuestionDto ToDto(Question question)
        {
            return new QuestionDto
            {
                Id = question.Id,
                TopicId = question.TopicId,
                TopicName = question.Topic?.TopicName ?? string.Empty,
                DeletedAt = question.DeletedAt,
                QuestionText = question.QuestionText,
                QuestionImage = question.QuestionImage,
                Choices = question.Choices
                    .Select(c => new ChoiceDto
                    {
                        Id = c.Id,
                        QuestionId = c.QuestionId,
                        ChoiceText = c.ChoiceText,
                        IsCorrect = c.IsCorrect
                    })
                    .ToList()
            };
        }

        public static Question FromCreateDto(CreateQuestionDto dto)
        {
            return new Question
            {
                QuestionText = dto.QuestionText.Trim(),
                QuestionImage = string.IsNullOrWhiteSpace(dto.QuestionImage) ? null : dto.QuestionImage.Trim(),
                TopicId = dto.TopicId,
                Choices = dto.Choices.Select(c => new Choice
                {
                    ChoiceText = c.ChoiceText.Trim(),
                    IsCorrect = c.IsCorrect
                }).ToList()
            };
        }

        public static void ApplyPatch(Question target, PatchQuestionDto patch)
        {
            if (patch.TopicId.HasValue)
            {
                target.TopicId = patch.TopicId.Value;
            }

            if (patch.QuestionText != null)
            {
                target.QuestionText = patch.QuestionText.Trim();
            }

            if (patch.QuestionImage != null)
            {
                target.QuestionImage = patch.QuestionImage.Trim();
            }

            if (patch.Choices != null)
            {
                target.Choices.Clear();
                foreach (var choice in patch.Choices)
                {
                    target.Choices.Add(new Choice
                    {
                        ChoiceText = choice.ChoiceText!.Trim(),
                        IsCorrect = choice.IsCorrect!.Value
                    });
                }
            }
        }

        public static void ApplyUpdate(Question target, UpdateQuestionDto dto)
        {
            target.QuestionText = dto.QuestionText.Trim();
            target.QuestionImage = string.IsNullOrWhiteSpace(dto.QuestionImage) ? null : dto.QuestionImage.Trim();
            target.TopicId = dto.TopicId;

            target.Choices.Clear();
            foreach (var choice in dto.Choices)
            {
                target.Choices.Add(new Choice
                {
                    ChoiceText = choice.ChoiceText.Trim(),
                    IsCorrect = choice.IsCorrect
                });
            }
        }
    }
}
