/*
using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Validators;

public class RegisterAdminValidator : AbstractValidator<RegisterAdminDto>
{
    public RegisterAdminValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        
        RuleFor(x => x.Role)
            .IsInEnum();

    }
}

*/