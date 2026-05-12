using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators;

public class CompleteRegisterAdminValidator : AbstractValidator<CompleteRegisterAdminDto>
{
    public CompleteRegisterAdminValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithMessage("Valid email is required");
            
    }
}