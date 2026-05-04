using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Validators;

public class StartExamValidator : AbstractValidator<StartExamDto>
{
    public StartExamValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required");
    }
}