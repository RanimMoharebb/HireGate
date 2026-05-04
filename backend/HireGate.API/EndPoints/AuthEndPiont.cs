using HireGate.Service.Interfaces;
using HireGate.Repository.Interfaces;
using HireGate.Service.DTOs;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;

namespace HireGate.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth");

        // LOGIN
        group.MapPost("/login", async (
            [FromBody] LoginDto dto,
            [FromServices] IAuthService service,
            [FromServices] IValidator<LoginDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var token = await service.Login(dto.Email, dto.Password);
            return Results.Ok(new { token });
        });

        // COMPLETE REGISTRATION
        group.MapPost("/complete-registration", async (
            [FromBody] CompleteRegisterAdminDto dto,
            [FromServices] IAuthService service,
            [FromServices] IValidator<CompleteRegisterAdminDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.CompleteRegistration(dto);
            return Results.Ok(result);
        });

        // FORGOT PASSWORD
        app.MapPost("/forgot-password", async (
            ForgotPasswordDto dto,
            IAdminService service,
            IValidator<ForgotPasswordDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            await service.ForgotPassword(dto);
            return Results.Ok("If email exists, reset link sent");
        });

        // RESET PASSWORD
        app.MapPost("/reset-password", async (
            ResetPasswordDto dto,
            IAdminService service,
            IValidator<ResetPasswordDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.ResetPassword(dto);

            return result
                ? Results.Ok("Password reset successful")
                : Results.BadRequest("Invalid or expired token");
        });
    }
}