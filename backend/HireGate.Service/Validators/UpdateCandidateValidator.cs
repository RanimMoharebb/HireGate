using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Validators;

public class UpdateCandidateValidator : AbstractValidator<UpdateCandidateDto>
{
    public UpdateCandidateValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(30);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(30);

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^01\d{9}$")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
            .WithMessage("Phone number must be valid");
    }
}