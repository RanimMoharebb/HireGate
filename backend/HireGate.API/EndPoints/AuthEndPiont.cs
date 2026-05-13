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

            var result = await service.Login(dto.Email, dto.Password);

            if (result.Message == "Invalid credentials")
                return Results.BadRequest(result);

            return Results.Ok(result);
        });

        // COMPLETE REGISTRATION
        group.MapPost("/complete-registration", async (
            [FromBody] CompleteRegisterAdminDto dto,
            [FromServices] IAuthService service,
            [FromServices] IValidator<CompleteRegisterAdminDto> validator
        ) =>
        {
            // 1. Validate request
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = validation.Errors.First().ErrorMessage
                });
            }

            // 2. Call service
            var result = await service.CompleteRegistration(dto);

            // 3. Handle known business cases
            if (result.Message == "Admin not found")
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            if (result.Message == "Already registered")
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            // 4. Success response
            return Results.Ok(new
            {
                success = true,
                message = result.Message
            });
        });

        // FORGOT PASSWORD
        group.MapPost("/forgot-password", async (
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
        group.MapPost("/reset-password", async (
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