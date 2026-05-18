using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Service.Interfaces;

namespace HireGate.Service.Implementations
{
    public class ChoiceService : IChoiceService
    {
        private readonly IChoiceRepository _choiceRepository;
        private readonly IQuestionRepository _questionRepository;

        private const int MaxChoicesPerQuestion = 4;
        private const int MinChoicesPerQuestion = 2;

        public ChoiceService(IChoiceRepository choiceRepository, IQuestionRepository questionRepository)
        {
            _choiceRepository = choiceRepository;
            _questionRepository = questionRepository;
        }

        public async Task<IReadOnlyList<ChoiceDto>> GetChoicesForQuestionAsync(int questionId)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            var exists = await _questionRepository.QuestionExistsAsync(questionId);
            if (!exists)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            var choices = await _choiceRepository.GetChoicesByQuestionIdAsync(questionId);
            return choices.Select(MapToChoiceDto).ToList();
        }

        public async Task<ChoiceDto> AddChoiceAsync(int questionId, CreateChoiceDto createChoiceDto)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            if (createChoiceDto == null)
                throw new ArgumentNullException(nameof(createChoiceDto));

            if (string.IsNullOrWhiteSpace(createChoiceDto.ChoiceText))
                throw new ArgumentException("Choice text is required", nameof(createChoiceDto.ChoiceText));

            var question = await _questionRepository.GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            if (question.Choices.Count >= MaxChoicesPerQuestion)
                throw new ArgumentException($"Question cannot have more than {MaxChoicesPerQuestion} choices");

            if (createChoiceDto.IsCorrect)
            {
                // Don't allow adding a second correct choice
                if (question.Choices.Any(c => c.IsCorrect))
                    throw new ArgumentException("Question already has a correct choice");
            }
            else
            {
                // New choice is not correct — ensure there is already exactly one correct choice
                if (!question.Choices.Any(c => c.IsCorrect))
                    throw new ArgumentException("Question must have exactly one correct choice");
            }

            var choice = new Choice
            {
                QuestionId = questionId,
                ChoiceText = createChoiceDto.ChoiceText.Trim(),
                IsCorrect = createChoiceDto.IsCorrect
            };

            var createdChoice = await _choiceRepository.CreateChoiceAsync(choice);
            return MapToChoiceDto(createdChoice);
        }

        public async Task<ChoiceDto> UpdateChoiceAsync(int questionId, int choiceId, UpdateChoiceDto updateChoiceDto)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            if (choiceId <= 0)
                throw new ArgumentException("Invalid choice ID", nameof(choiceId));

            if (updateChoiceDto == null)
                throw new ArgumentNullException(nameof(updateChoiceDto));

            if (string.IsNullOrWhiteSpace(updateChoiceDto.ChoiceText))
                throw new ArgumentException("Choice text is required", nameof(updateChoiceDto.ChoiceText));

            var question = await _questionRepository.GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            var choice = question.Choices.FirstOrDefault(c => c.Id == choiceId);
            if (choice == null)
                throw new KeyNotFoundException($"Choice with ID {choiceId} not found in question {questionId}");

            choice.ChoiceText = updateChoiceDto.ChoiceText.Trim();

            if (updateChoiceDto.IsCorrect)
            {
                // If another choice is already correct, reject marking this one
                var otherCorrectExists = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                if (otherCorrectExists)
                    throw new ArgumentException("Question already has a correct choice");

                choice.IsCorrect = true;
            }
            else
            {
                // If unmarking this choice would leave zero correct choices, reject
                var otherHasCorrect = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                if (!otherHasCorrect)
                    throw new ArgumentException("Question must have exactly one correct choice");

                choice.IsCorrect = false;
            }

            var updatedChoice = await _choiceRepository.UpdateChoiceAsync(choice);
            return MapToChoiceDto(updatedChoice);
        }

        public async Task<ChoiceDto> PatchChoiceAsync(int questionId, int choiceId, PatchChoiceDto patchChoiceDto)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            if (choiceId <= 0)
                throw new ArgumentException("Invalid choice ID", nameof(choiceId));

            if (patchChoiceDto == null)
                throw new ArgumentNullException(nameof(patchChoiceDto));

            var question = await _questionRepository.GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            var choice = question.Choices.FirstOrDefault(c => c.Id == choiceId);
            if (choice == null)
                throw new KeyNotFoundException($"Choice with ID {choiceId} not found in question {questionId}");

            if (patchChoiceDto.ChoiceText != null)
            {
                if (string.IsNullOrWhiteSpace(patchChoiceDto.ChoiceText))
                    throw new ArgumentException("Choice text cannot be empty", nameof(patchChoiceDto.ChoiceText));

                choice.ChoiceText = patchChoiceDto.ChoiceText.Trim();
            }
            if (patchChoiceDto.IsCorrect.HasValue)
            {
                if (patchChoiceDto.IsCorrect.Value)
                {
                    // Reject if another choice is already correct
                    var otherCorrectExists = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                    if (otherCorrectExists)
                        throw new ArgumentException("Question already has a correct choice");

                    choice.IsCorrect = true;
                }
                else
                {
                    // Unmarking — ensure another correct choice exists
                    var otherHasCorrect = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                    if (!otherHasCorrect)
                        throw new ArgumentException("Question must have exactly one correct choice");

                    choice.IsCorrect = false;
                }
            }

            var patchedChoice = await _choiceRepository.UpdateChoiceAsync(choice);
            return MapToChoiceDto(patchedChoice);
        }

        public async Task<bool> DeleteChoiceAsync(int questionId, int choiceId)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            if (choiceId <= 0)
                throw new ArgumentException("Invalid choice ID", nameof(choiceId));

            var question = await _questionRepository.GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            var choice = question.Choices.FirstOrDefault(c => c.Id == choiceId);
            if (choice == null)
                throw new KeyNotFoundException($"Choice with ID {choiceId} not found in question {questionId}");

            if (question.Choices.Count <= MinChoicesPerQuestion)
                throw new ArgumentException($"Question must have at least {MinChoicesPerQuestion} choices");

            var wouldLeaveNoCorrectChoice = choice.IsCorrect && question.Choices.Count(c => c.IsCorrect) == 1;
            if (wouldLeaveNoCorrectChoice)
                throw new ArgumentException("Question must have at least one correct choice");

            return await _choiceRepository.DeleteChoiceAsync(choice);
        }

        // Enforcement for exactly-one-correct handled inline in methods above.

        private static ChoiceDto MapToChoiceDto(Choice choice)
        {
            return new ChoiceDto
            {
                Id = choice.Id,
                QuestionId = choice.QuestionId,
                ChoiceText = choice.ChoiceText,
                IsCorrect = choice.IsCorrect
            };
        }
    }
}
