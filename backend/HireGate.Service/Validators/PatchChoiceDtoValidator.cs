using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators
{
    public class PatchChoiceDtoValidator : AbstractValidator<PatchChoiceDto>
    {
        public PatchChoiceDtoValidator()
        {
            When(x => x.ChoiceText != null, () =>
            {
                RuleFor(x => x.ChoiceText)
                    .NotEmpty()
                    .Length(1, 200)
                    .WithMessage("Choice text cannot be empty");
            });
        }
    }
}
