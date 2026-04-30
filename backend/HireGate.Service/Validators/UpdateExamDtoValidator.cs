using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators
{
    public class UpdateExamDtoValidator : AbstractValidator<UpdateExamDto>
    {
        public UpdateExamDtoValidator()
        {
            RuleFor(x => x.PositionTitle)
                .NotEmpty()
                .Length(3, 100)
                .When(x => x.PositionTitle is not null);

            RuleFor(x => x.DurationMinutes)
                .GreaterThan(0)
                .When(x => x.DurationMinutes.HasValue);

            RuleFor(x => x.WindowEndTime)
                .GreaterThan(x => x.WindowStartTime)
                .When(x => x.WindowStartTime.HasValue && x.WindowEndTime.HasValue);
        }
    }
}
