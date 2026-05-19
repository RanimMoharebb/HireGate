using FluentValidation;
using HireGate.Repository.Interfaces;
using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Data.Models;
using HireGate.Service.Validators;
using HireGate.Service.Mappers;

namespace HireGate.Service.Implementations
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repository;
        private readonly IValidator<CreateQuestionDto> _createValidator;
        private readonly IValidator<UpdateQuestionDto> _updateValidator;
        private readonly IValidator<PatchQuestionDto> _patchValidator;
        private const int MinChoicesPerQuestion = 2;
        private const int MaxChoicesPerQuestion = 4;

        public QuestionService(
            IQuestionRepository repository,
            IValidator<CreateQuestionDto> createValidator,
            IValidator<UpdateQuestionDto> updateValidator,
            IValidator<PatchQuestionDto> patchValidator)
        {
            _repository = repository;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _patchValidator = patchValidator;
        }


        public async Task<QuestionDto?> GetQuestionByIdAsync(int id)
        {
            ValidateId(id);
            var question = await _repository.GetQuestionByIdAsync(id);
            return question == null ? null : QuestionMapper.ToDto(question);
        }

        public async Task<(IEnumerable<QuestionDto> Items, int TotalCount)> GetAllQuestionsAsync(int pageNumber, int pageSize, int? topicId = null, string? search = null, bool? isDeleted = false)
        {
            if (topicId.HasValue && topicId.Value <= 0)
                throw new ArgumentException("Invalid topic ID", nameof(topicId));

            var (items, totalCount) = await _repository.GetAllQuestionsAsync(pageNumber, pageSize, topicId, search, isDeleted);
            return (items.Select(QuestionMapper.ToDto).ToList(), totalCount);
        }   

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto createQuestionDto)
        {
            var dto = createQuestionDto ?? throw new ArgumentNullException(nameof(createQuestionDto));
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var question = QuestionMapper.FromCreateDto(dto);

            var createdQuestion = await _repository.CreateQuestionAsync(question);
            return QuestionMapper.ToDto(createdQuestion);
        }

        public async Task<QuestionDto> UpdateQuestionAsync(int id, UpdateQuestionDto updateQuestionDto)
        {
            ValidateId(id);
            if (updateQuestionDto == null)
                throw new ArgumentNullException(nameof(updateQuestionDto));

            var existingQuestion = await GetExistingQuestionOrThrowAsync(id);

            var validationResult = await _updateValidator.ValidateAsync(updateQuestionDto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            QuestionMapper.ApplyUpdate(existingQuestion, updateQuestionDto);

            var updatedQuestion = await _repository.UpdateQuestionAsync(existingQuestion);
            return QuestionMapper.ToDto(updatedQuestion);
        }

        public async Task<QuestionDto> PatchQuestionAsync(int id, PatchQuestionDto patchQuestionDto)
        {
            ValidateId(id);
            if (patchQuestionDto == null)
                throw new ArgumentNullException(nameof(patchQuestionDto));

            var existingQuestion = await GetExistingQuestionOrThrowAsync(id);

            var validationResult = await _patchValidator.ValidateAsync(patchQuestionDto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            QuestionMapper.ApplyPatch(existingQuestion, patchQuestionDto);

            var patchedQuestion = await _repository.UpdateQuestionAsync(existingQuestion);
            return QuestionMapper.ToDto(patchedQuestion);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            ValidateId(id);
            var exists = await _repository.QuestionExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Question with ID {id} not found");

            return await _repository.DeleteQuestionAsync(id);
        }

        public async Task<bool> RestoreQuestionAsync(int id)
        {
            ValidateId(id);
            var exists = await _repository.QuestionExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Question with ID {id} not found");

            var restored = await _repository.RestoreQuestionAsync(id);
            if (!restored)
                throw new InvalidOperationException($"Question with ID {id} is not deleted");

            return true;
        }

        private static bool IsValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
                   (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }

                private void ValidateId(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid question ID", nameof(id));
        }

        private async Task<Question> GetExistingQuestionOrThrowAsync(int id)
        {
            var existing = await _repository.GetQuestionByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Question with ID {id} not found");
            return existing;
        }

    }
}
