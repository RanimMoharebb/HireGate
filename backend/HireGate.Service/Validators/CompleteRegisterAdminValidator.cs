using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators;

public class CompleteRegisterAdminValidator : AbstractValidator<CompleteRegisterAdminDto>
{
    public CompleteRegisterAdminValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);

        RuleFor(x => x.FirstName)
            .NotEmpty();

        RuleFor(x => x.LastName)
            .NotEmpty();
    }
}