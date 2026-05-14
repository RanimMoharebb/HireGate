using FluentValidation;
using HireGate.Service.DTOs;

public class UpdateAdminRoleDtoValidator
    : AbstractValidator<UpdateAdminRoleDto>
{
    public UpdateAdminRoleDtoValidator()
    {
        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(BeValidRole)
            .WithMessage("Invalid role");
    }

    private bool BeValidRole(string? role)
    {
        return Enum.TryParse(typeof(UserRoleDto), role, true, out _);
    }
}