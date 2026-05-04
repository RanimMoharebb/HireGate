using FluentValidation;
using HireGate.Service.DTOs;

public class UpdateAdminRoleDtoValidator : AbstractValidator<UpdateAdminRoleDto>
{
    public UpdateAdminRoleDtoValidator()
    {
        RuleFor(x => x.Role)
            .IsInEnum()
            .WithMessage("Invalid role");
    }
}