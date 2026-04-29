using FluentValidation;
using HireGate.Service.DTOs;
namespace HireGate.Service.Validators
{
    public class CreateExamDtoValidator : AbstractValidator<CreateExamDto>
    {
        public CreateExamDtoValidator()
        {
            RuleFor(x => x.PositionTitle)
                .NotEmpty()
                .Length(3, 100);

            RuleFor(x => x.DurationMinutes)
                .GreaterThan(0);

            RuleFor(x => x.WindowEndTime)
                .GreaterThan(x => x.WindowStartTime)
                .When(x => x.WindowStartTime.HasValue && x.WindowEndTime.HasValue);

            RuleFor(x => x.QuestionIds)
                .NotNull();

            RuleFor(x => x.QuestionIds)
                .NotEmpty()
                .WithMessage("At least one question ID is required.");

            RuleForEach(x => x.QuestionIds)
                .GreaterThan(0);

            RuleFor(x => x.QuestionIds)
                .Must(questionIds => questionIds.Distinct().Count() == questionIds.Count)
                .When(x => x.QuestionIds != null)
                .WithMessage("Question IDs must be unique.");
        }
    }
}
