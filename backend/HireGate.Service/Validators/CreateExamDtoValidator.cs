using FluentValidation;
using backend.HireGate.Service.DTOs;

namespace backend.HireGate.Service.Validators
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
                
        }
    }
}