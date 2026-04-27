using FluentValidation;
using backend.HireGate.Service.DTOs;

namespace backend.HireGate.Service.Validators
{
    public class ChoiceDtoValidator : AbstractValidator<ChoiceDto>
    {
        public ChoiceDtoValidator()
        {
            RuleFor(x => x.ChoiceText)
                .NotEmpty()
                .Length(1, 200);
        }
    }
}