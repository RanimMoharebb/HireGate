using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace HireGate.API.Endpoints;

public static class CandidateEndpoints
{
    public static void MapCandidateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/candidates");

        // CREATE

group.MapPost("/", async (
    [FromBody] CreateCandidateDto dto,
    [FromServices] ICandidateService service,
    [FromServices] IValidator<CreateCandidateDto> validator
) =>
{
    var validation = await validator.ValidateAsync(dto);

    if (!validation.IsValid)
        return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

    var result = await service.CreateCandidate(dto);

    if (result.Message == "Email already exists")
        return Results.BadRequest(result);

    return Results.Ok(result);
})
.RequireAuthorization();

        // COMPLETE PROFILE
        group.MapPut("/complete-profile/{token}", async (
            string token,
            [FromBody] CompleteCandidateProfileDto dto,
            [FromServices] ICandidateService service,
            [FromServices] IValidator<CompleteCandidateProfileDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.CompleteProfile(token, dto);

            if (result == null)
                return Results.NotFound("Invalid token");

            return Results.Ok(result);
        })
        .RequireAuthorization();

        // GET ALL (paginated)
        group.MapGet("/", async (
            [FromServices] ICandidateService service,
            int page = 1,
            int pageSize = 10,
            string? search = null) =>
        {
            var validPage = Math.Max(1, page);
            var validPageSize = Math.Min(Math.Max(1, pageSize), 100);
            var (data, totalCount) = await service.GetAll(validPage, validPageSize, search);
            var totalPages = validPageSize == 0 ? 0 : (int)Math.Ceiling((double)totalCount / validPageSize);

            return Results.Ok(new
            {
                data,
                page = validPage,
                pageSize = validPageSize,
                totalCount,
                totalPages
            });
        });
        
        // GET BY ID
        group.MapGet("/{id:int}", async (
            int id,
            [FromServices] ICandidateService service
        ) =>
        {
            var result = await service.GetById(id);

            if (result == null)
                return Results.NotFound("Candidate not found");

            return Results.Ok(result);
        })
        .RequireAuthorization();

        // DELETE BY ID
        group.MapDelete("/{id:int}", async (
            int id,
            [FromServices] ICandidateService service
        ) =>
        {
            var result = await service.Delete(id);

            return result is null
                ? Results.NotFound("Candidate not found")
                : Results.Ok(result);
        })
        .RequireAuthorization();

        // SEND EMAIL
        group.MapPost("/{id:int}/send-exam-email", async (
            int id,
            [FromBody] SendExamEmailDto dto,
            [FromServices] ICandidateService service,
            [FromServices] IValidator<SendExamEmailDto> validator
        ) =>
        {
            dto.CandidateId = id;

            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.SendExamEmail(dto);

            return Results.Ok(result);
        })
        .RequireAuthorization();

        // Send BULK EMAIL
        group.MapPost("/send-bulk-exam-email", async (
            [FromBody] SendBulkExamEmailDto dto,
            [FromServices] ICandidateService service,
            [FromServices] IValidator<SendBulkExamEmailDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.SendBulkExamEmail(dto);

            return Results.Ok(result);
        })
        .RequireAuthorization();

        // START EXAM

group.MapPost("/start-exam/{token}", async (
    string token,
    [FromServices] ICandidateService service
) =>
{
    var result = await service.StartExam(token);

    if (result is string message)
        return Results.BadRequest(message);

    return Results.Ok(result);
});

        // EXAM PAGE
        group.MapGet("/exam-page/{token}", async (
            string token,
            [FromServices] ICandidateService service
        ) =>
        {
            var result = await service.GetExamPage(token);

            return result is null
                ? Results.BadRequest("Exam is not available at this time")
                : Results.Ok(result);
        })
        .RequireAuthorization();
    }
}