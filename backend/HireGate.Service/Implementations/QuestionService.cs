using HireGate.Repository.Interfaces;
using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Data.Models;

namespace HireGate.Service.Implementations
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repository;

        public QuestionService(IQuestionRepository repository)
        {
            _repository = repository;
        }


        public async Task<QuestionDto?> GetQuestionByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid question ID", nameof(id));

            var question = await _repository.GetQuestionByIdAsync(id);
            return question == null ? null : MapToQuestionDto(question);
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _repository.GetAllQuestionsAsync();
            return questions.Select(MapToQuestionDto).ToList();
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByTopicIdAsync(int topicId)
        {
            if (topicId <= 0)
                throw new ArgumentException("Invalid topic ID", nameof(topicId));

            var questions = await _repository.GetQuestionsByTopicIdAsync(topicId);
            return questions.Select(MapToQuestionDto).ToList();
        }

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto createQuestionDto)
        {
            if (createQuestionDto == null)
                throw new ArgumentNullException(nameof(createQuestionDto));

            if (string.IsNullOrWhiteSpace(createQuestionDto.QuestionText))
                throw new ArgumentException("Question text is required", nameof(createQuestionDto.QuestionText));

            if (createQuestionDto.TopicId <= 0)
                throw new ArgumentException("Valid topic ID is required", nameof(createQuestionDto.TopicId));

            if (createQuestionDto.Choices == null || !createQuestionDto.Choices.Any())
                throw new ArgumentException("At least one choice is required", nameof(createQuestionDto.Choices));

            // Verify at least one correct answer
            if (!createQuestionDto.Choices.Any(c => c.IsCorrect))
                throw new ArgumentException("At least one choice must be marked as correct");

            if (!string.IsNullOrWhiteSpace(createQuestionDto.QuestionImage) &&
                !IsValidUrl(createQuestionDto.QuestionImage))
            {
                throw new ArgumentException("Question image must be a valid URL", nameof(createQuestionDto.QuestionImage));
            }

            var question = new Question
            {
                QuestionText = createQuestionDto.QuestionText.Trim(),
                QuestionImage = string.IsNullOrWhiteSpace(createQuestionDto.QuestionImage) ? null : createQuestionDto.QuestionImage.Trim(),
                TopicId = createQuestionDto.TopicId,
                Choices = createQuestionDto.Choices
                    .Select(c => new Choice
                    {
                        ChoiceText = c.ChoiceText.Trim(),
                        IsCorrect = c.IsCorrect
                    })
                    .ToList()
            };

            var createdQuestion = await _repository.CreateQuestionAsync(question);
            return MapToQuestionDto(createdQuestion);
        }

        public async Task<QuestionDto> UpdateQuestionAsync(int id, UpdateQuestionDto updateQuestionDto)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid question ID", nameof(id));

            if (updateQuestionDto == null)
                throw new ArgumentNullException(nameof(updateQuestionDto));

            var existingQuestion = await _repository.GetQuestionByIdAsync(id);
            if (existingQuestion == null)
                throw new KeyNotFoundException($"Question with ID {id} not found");

            if (string.IsNullOrWhiteSpace(updateQuestionDto.QuestionText))
                throw new ArgumentException("Question text is required", nameof(updateQuestionDto.QuestionText));

            if (!updateQuestionDto.Choices.Any(c => c.IsCorrect))
                throw new ArgumentException("At least one choice must be marked as correct");

            if (!string.IsNullOrWhiteSpace(updateQuestionDto.QuestionImage) &&
                !IsValidUrl(updateQuestionDto.QuestionImage))
            {
                throw new ArgumentException("Question image must be a valid URL", nameof(updateQuestionDto.QuestionImage));
            }

            existingQuestion.QuestionText = updateQuestionDto.QuestionText.Trim();
            existingQuestion.QuestionImage = string.IsNullOrWhiteSpace(updateQuestionDto.QuestionImage) ? null : updateQuestionDto.QuestionImage.Trim();
            existingQuestion.TopicId = updateQuestionDto.TopicId;

            existingQuestion.Choices.Clear();
            foreach (var choice in updateQuestionDto.Choices)
            {
                existingQuestion.Choices.Add(new Choice
                {
                    ChoiceText = choice.ChoiceText,
                    IsCorrect = choice.IsCorrect
                });
            }

            var updatedQuestion = await _repository.UpdateQuestionAsync(existingQuestion);
            return MapToQuestionDto(updatedQuestion);
        }

        public async Task<QuestionDto> PatchQuestionAsync(int id, PatchQuestionDto patchQuestionDto)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid question ID", nameof(id));

            if (patchQuestionDto == null)
                throw new ArgumentNullException(nameof(patchQuestionDto));

            var existingQuestion = await _repository.GetQuestionByIdAsync(id);
            if (existingQuestion == null)
                throw new KeyNotFoundException($"Question with ID {id} not found");

            if (patchQuestionDto.TopicId.HasValue)
            {
                if (patchQuestionDto.TopicId.Value <= 0)
                    throw new ArgumentException("Valid topic ID is required", nameof(patchQuestionDto.TopicId));

                existingQuestion.TopicId = patchQuestionDto.TopicId.Value;
            }

            if (patchQuestionDto.QuestionText != null)
            {
                if (string.IsNullOrWhiteSpace(patchQuestionDto.QuestionText))
                    throw new ArgumentException("Question text cannot be empty", nameof(patchQuestionDto.QuestionText));

                existingQuestion.QuestionText = patchQuestionDto.QuestionText.Trim();
            }

            if (patchQuestionDto.QuestionImage != null)
            {
                if (string.IsNullOrWhiteSpace(patchQuestionDto.QuestionImage))
                    throw new ArgumentException("Question image cannot be empty", nameof(patchQuestionDto.QuestionImage));

                if (!IsValidUrl(patchQuestionDto.QuestionImage))
                    throw new ArgumentException("Question image must be a valid URL", nameof(patchQuestionDto.QuestionImage));

                existingQuestion.QuestionImage = patchQuestionDto.QuestionImage.Trim();
            }

            if (patchQuestionDto.Choices != null)
            {
                if (!patchQuestionDto.Choices.Any())
                    throw new ArgumentException("At least one choice is required", nameof(patchQuestionDto.Choices));

                if (patchQuestionDto.Choices.Any(c => !c.IsCorrect.HasValue))
                    throw new ArgumentException("IsCorrect is required for all choices", nameof(patchQuestionDto.Choices));

                if (!patchQuestionDto.Choices.Any(c => c.IsCorrect == true))
                    throw new ArgumentException("At least one choice must be marked as correct", nameof(patchQuestionDto.Choices));

                if (patchQuestionDto.Choices.Any(c => string.IsNullOrWhiteSpace(c.ChoiceText)))
                    throw new ArgumentException("Choice text is required for all choices", nameof(patchQuestionDto.Choices));

                existingQuestion.Choices.Clear();
                foreach (var choice in patchQuestionDto.Choices)
                {
                    existingQuestion.Choices.Add(new Choice
                    {
                        ChoiceText = choice.ChoiceText!.Trim(),
                        IsCorrect = choice.IsCorrect!.Value
                    });
                }
            }
            var patchedQuestion = await _repository.UpdateQuestionAsync(existingQuestion);
            return MapToQuestionDto(patchedQuestion);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid question ID", nameof(id));

            var exists = await _repository.QuestionExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Question with ID {id} not found");

            return await _repository.DeleteQuestionAsync(id);
        }

        private QuestionDto MapToQuestionDto(Question question)
        {
            return new QuestionDto
            {
                Id = question.Id,
                TopicId = question.TopicId,
                TopicName = question.Topic?.TopicName ?? string.Empty,
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

        private static bool IsValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
                   (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }

    }
}
