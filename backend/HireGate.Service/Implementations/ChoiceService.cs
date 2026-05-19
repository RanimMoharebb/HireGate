using FluentValidation;
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
        private readonly IValidator<CreateChoiceDto> _createValidator;
        private readonly IValidator<UpdateChoiceDto> _updateValidator;
        private readonly IValidator<PatchChoiceDto> _patchValidator;

        private const int MaxChoicesPerQuestion = 4;
        private const int MinChoicesPerQuestion = 2;

        public ChoiceService(
            IChoiceRepository choiceRepository,
            IQuestionRepository questionRepository,
            IValidator<CreateChoiceDto> createValidator,
            IValidator<UpdateChoiceDto> updateValidator,
            IValidator<PatchChoiceDto> patchValidator)
        {
            _choiceRepository = choiceRepository;
            _questionRepository = questionRepository;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _patchValidator = patchValidator;
        }


        private async Task<Question> GetQuestionOrThrowAsync(int questionId)
        {
            ValidateId(questionId, nameof(questionId));
            var question = await _questionRepository.GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");
            return question;
        }

        private Choice GetChoiceOrThrow(Question question, int choiceId)
        {
            ValidateId(choiceId, nameof(choiceId));
            var choice = question.Choices.FirstOrDefault(c => c.Id == choiceId);
            if (choice == null)
                throw new KeyNotFoundException($"Choice with ID {choiceId} not found in question {question.Id}");
            return choice;
        }

        public async Task<IReadOnlyList<ChoiceDto>> GetChoicesForQuestionAsync(int questionId)
        {
            if (questionId <= 0)
                throw new ArgumentException("Invalid question ID", nameof(questionId));

            var exists = await _questionRepository.QuestionExistsAsync(questionId);
            if (!exists)
                throw new KeyNotFoundException($"Question with ID {questionId} not found");

            var choices = await _choiceRepository.GetChoicesByQuestionIdAsync(questionId);
            return choices.Select(HireGate.Service.Mappers.ChoiceMapper.ToDto).ToList();
        }

        public async Task<ChoiceDto> AddChoiceAsync(int questionId, CreateChoiceDto createChoiceDto)
        {
            ValidateId(questionId, nameof(questionId));

            var dto = createChoiceDto ?? throw new ArgumentNullException(nameof(createChoiceDto));

            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var question = await GetQuestionOrThrowAsync(questionId);

            if (question.Choices.Count >= MaxChoicesPerQuestion)
                throw new ArgumentException($"Question cannot have more than {MaxChoicesPerQuestion} choices");

            if (dto.IsCorrect)
            {
                if (question.Choices.Any(c => c.IsCorrect))
                    throw new ArgumentException("Question already has a correct choice");
            }
            else
            {
                if (!question.Choices.Any(c => c.IsCorrect))
                    throw new ArgumentException("Question must have exactly one correct choice");
            }

            var choice = HireGate.Service.Mappers.ChoiceMapper.FromCreateDto(dto);

            var createdChoice = await _choiceRepository.CreateChoiceAsync(choice);
            return HireGate.Service.Mappers.ChoiceMapper.ToDto(createdChoice);
        }

        public async Task<ChoiceDto> UpdateChoiceAsync(int questionId, int choiceId, UpdateChoiceDto updateChoiceDto)
        {
            ValidateId(questionId, nameof(questionId));
            ValidateId(choiceId, nameof(choiceId));

            var dto = updateChoiceDto ?? throw new ArgumentNullException(nameof(updateChoiceDto));

            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var question = await GetQuestionOrThrowAsync(questionId);
            var choice = GetChoiceOrThrow(question, choiceId);

            // Business rules for correct choice handling
            if (dto.IsCorrect)
            {
                var otherCorrectExists = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                if (otherCorrectExists)
                    throw new ArgumentException("Question already has a correct choice");
            }
            else
            {
                var otherHasCorrect = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                if (!otherHasCorrect)
                    throw new ArgumentException("Question must have exactly one correct choice");
            }

            HireGate.Service.Mappers.ChoiceMapper.ApplyUpdate(choice, dto);

            var updatedChoice = await _choiceRepository.UpdateChoiceAsync(choice);
            return HireGate.Service.Mappers.ChoiceMapper.ToDto(updatedChoice);
        }

        public async Task<ChoiceDto> PatchChoiceAsync(int questionId, int choiceId, PatchChoiceDto patchChoiceDto)
        {
            ValidateId(questionId, nameof(questionId));
            ValidateId(choiceId, nameof(choiceId));

            var dto = patchChoiceDto ?? throw new ArgumentNullException(nameof(patchChoiceDto));

            var validationResult = await _patchValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var question = await GetQuestionOrThrowAsync(questionId);
            var choice = GetChoiceOrThrow(question, choiceId);

            if (dto.IsCorrect.HasValue)
            {
                if (dto.IsCorrect.Value)
                {
                    var otherCorrectExists = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                    if (otherCorrectExists)
                        throw new ArgumentException("Question already has a correct choice");
                }
                else
                {
                    var otherHasCorrect = question.Choices.Any(c => c.Id != choiceId && c.IsCorrect);
                    if (!otherHasCorrect)
                        throw new ArgumentException("Question must have exactly one correct choice");
                }
            }

            HireGate.Service.Mappers.ChoiceMapper.ApplyPatch(choice, dto);

            var patchedChoice = await _choiceRepository.UpdateChoiceAsync(choice);
            return HireGate.Service.Mappers.ChoiceMapper.ToDto(patchedChoice);
        }

        public async Task<bool> DeleteChoiceAsync(int questionId, int choiceId)
        {
            ValidateId(questionId, nameof(questionId));
            ValidateId(choiceId, nameof(choiceId));

            var question = await GetQuestionOrThrowAsync(questionId);
            var choice = GetChoiceOrThrow(question, choiceId);

            if (question.Choices.Count <= MinChoicesPerQuestion)
                throw new ArgumentException($"Question must have at least {MinChoicesPerQuestion} choices");

            var wouldLeaveNoCorrectChoice = choice.IsCorrect && question.Choices.Count(c => c.IsCorrect) == 1;
            if (wouldLeaveNoCorrectChoice)
                throw new ArgumentException("Question must have at least one correct choice");

            return await _choiceRepository.DeleteChoiceAsync(choice);
        }

        
        private void ValidateId(int id, string paramName)
        {
            if (id <= 0)
            {
                var message = paramName == nameof(CreateChoiceDto.QuestionId) || paramName == "questionId"
                    ? "Invalid question ID"
                    : "Invalid choice ID";
                throw new ArgumentException(message, paramName);
            }
        }
        
        
    }
}
