using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HireGate.API.Mapping;
using HireGate.ResultWrapper;

namespace HireGate.API.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/admins");

        // CREATE ADMIN
        group.MapPost("/", async (
            [FromBody] CreateAdminRequestDto dto,
            [FromServices] IAdminService service,
            [FromServices] IValidator<CreateAdminRequestDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var response = await service.CreateAdmin(dto);

            return ApiResponseMapper.ToHttpResult(response);
        });


        // GET ALL
        group.MapGet("/", async (
            [FromServices] IAdminService service,
            int page = 1,
            int pageSize = 10,
            string? search = null
        ) =>
        {
            var result = await service.GetAll(page, pageSize, search);

            return ApiResponseMapper.ToHttpResult(result);
        });


        // GET BY ID
        group.MapGet("/{id:int}", async (
            int id,
            [FromServices] IAdminService service
        ) =>
        {
            var result = await service.GetById(id);

            return ApiResponseMapper.ToHttpResult(result);
        });


        // DELETE
        group.MapDelete("/{id:int}", async (
            int id,
            [FromServices] IAdminService service
        ) =>
        {
            var result = await service.Delete(id);

            return ApiResponseMapper.ToHttpResult(result);
        });


        // UPDATE ROLE
        group.MapPatch("/{id:int}", async (
            int id,
            [FromBody] UpdateAdminRoleDto dto,
            [FromServices] IAdminService service,
            [FromServices] IValidator<UpdateAdminRoleDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return ApiResponseMapper.ToHttpResult(
                    ServiceResult<object>.Fail(validation.Errors.First().ErrorMessage)
                );

            var result = await service.UpdateRole(id, dto);

            return ApiResponseMapper.ToHttpResult(result);
        });


        // DEBUG ROLE (keep raw only if internal tool)
        group.MapGet("/debug-role", (HttpContext ctx) =>
        {
            var email = ctx.User.Claims.FirstOrDefault(c =>
                c.Type.Contains("emailaddress"))?.Value;

            var role = ctx.User.Claims.FirstOrDefault(c =>
                c.Type.Contains("role"))?.Value;

            return Results.Ok(new
            {
                email,
                roleFromToken = role
            });
        })
        .RequireAuthorization();
    }
}