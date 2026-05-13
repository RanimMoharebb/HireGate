using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HireGate.API.Endpoints;
public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/admins");
          //             .RequireAuthorization(policy => policy.RequireRole("CEO"));

        // CREATE ADMIN
        group.MapPost("/", async (
            [FromBody] CreateAdminRequestDto dto,
            [FromServices] IAdminService service,
            [FromServices] IValidator<CreateAdminRequestDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var response = await service.CreateAdmin(dto);

            if (response.Message == "Email already exists")
                return Results.BadRequest(response);

            return Results.Ok(response);
        })
        .RequireAuthorization(policy => policy.RequireRole("CEO"));
        
        // GET ALL
        group.MapGet("/", async (
            [FromServices] IAdminService service
        ) =>
        {
            return Results.Ok(await service.GetAll());
        })
        .RequireAuthorization(policy => policy.RequireRole("CEO"));

        // GET BY ID
        group.MapGet("/{id}", async (
            int id,
            [FromServices] IAdminService service
        ) =>
        {
            var admin = await service.GetById(id);

            if (admin == null)
                return Results.NotFound("Admin not found");

            return Results.Ok(admin);
        })
        .RequireAuthorization(policy => policy.RequireRole("CEO"));

        // DELETE
        group.MapDelete("/{id}", async (
            int id,
            [FromServices] IAdminService service
        ) =>
        {
            var result = await service.Delete(id);

            if (!result.Success)
                return Results.NotFound(result.Message);

            return Results.Ok(result);
        })
        .RequireAuthorization(policy => policy.RequireRole("CEO"));

        // UPDATE ROLE
        group.MapPatch("/{id}", async (
            int id,
            [FromBody] UpdateAdminRoleDto dto,
            [FromServices] IAdminService service,
            [FromServices] IValidator<UpdateAdminRoleDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
            {
                return Results.BadRequest(new
                {
                    message = validation.Errors.First().ErrorMessage
                });
            }


            var result = await service.UpdateRole(id, dto);

            if (result.Message == "Admin not found")
            {
                return Results.NotFound(new
                {
                    message = result.Message
                });
            }

            return Results.Ok(result);
        })
        .RequireAuthorization(policy => policy.RequireRole("CEO"));


        // DEBUG ROLE
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
    
        }).RequireAuthorization();


    }
}