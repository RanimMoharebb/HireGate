using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators
{
    public class CreateChoiceDtoValidator : AbstractValidator<CreateChoiceDto>
    {
        public CreateChoiceDtoValidator()
        {
            RuleFor(x => x.ChoiceText)
                .NotEmpty()
                .Length(1, 200)
                .WithMessage("Choice text is required");

            RuleFor(x => x.QuestionId)
                .GreaterThan(0)
                .WithMessage("Valid question ID is required");
        }
    }
}
