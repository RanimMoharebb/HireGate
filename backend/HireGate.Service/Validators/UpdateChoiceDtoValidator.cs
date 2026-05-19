using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators
{
    public class UpdateChoiceDtoValidator : AbstractValidator<UpdateChoiceDto>
    {
        public UpdateChoiceDtoValidator()
        {
            RuleFor(x => x.ChoiceText)
                .NotEmpty()
                .Length(1, 200)
                .WithMessage("Choice text is required");
        }
    }
}
