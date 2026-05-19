
using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HireGate.API.Mapping;
using HireGate.ResultWrapper;

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
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var result = await service.Login(dto.Email, dto.Password);

            return ApiResponseMapper.ToHttpResult(result);
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
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var result = await service.CompleteRegistration(dto);

            return ApiResponseMapper.ToHttpResult(result);
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
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var result = await service.ForgotPassword(dto);

            return ApiResponseMapper.ToHttpResult(result);
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
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var result = await service.ResetPassword(dto);

            return ApiResponseMapper.ToHttpResult(result);
        });
    }
}
