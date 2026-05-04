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

            return Results.Ok(await service.CreateCandidate(dto));
        });

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
        });

        // GET ALL
        group.MapGet("/", async ([FromServices] ICandidateService service) =>
        {
            return Results.Ok(await service.GetAll());
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
        });

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
        });

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
        });

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
        });

        // START EXAM
        group.MapPost("/start-exam", async (
            [FromBody] StartExamDto dto,
            [FromServices] ICandidateService service,
            [FromServices] IValidator<StartExamDto> validator
        ) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.BadRequest(validation.Errors.Select(e => e.ErrorMessage));

            var result = await service.StartExam(dto);

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
        });
    }
}