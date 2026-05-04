using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Service.Validators;
public class CreateAdminRequestDtoValidator : AbstractValidator<CreateAdminRequestDto>
{
    public CreateAdminRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Invalid role value");
    }
}