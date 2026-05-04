using FluentValidation;
using HireGate.Service.DTOs;
namespace HireGate.Service.Validators;

public class CompleteCandidateProfileValidator 
    : AbstractValidator<CompleteCandidateProfileDto>
{
    public CompleteCandidateProfileValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^01\d{9}$")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
    }
}