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
        });

        // GET ALL
        group.MapGet("/", async ([FromServices] ICandidateService service) =>
        {
            return Results.Ok(await service.GetAll());
        })
        .RequireAuthorization();
        
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

            try
            {
                var result = await service.SendExamEmail(dto);
                return Results.Ok(new {message = result});
            }
            catch (Exception)
            {
                return Results.BadRequest(new{
                    message = "Failed to send email. Please try again later."
                });
            }
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

            try
            {
                var result = await service.SendBulkExamEmail(dto);
                return Results.Ok(new {message = result});
            }
            catch (Exception)
            {
                return Results.BadRequest(new{
                    message = "Failed to send bulk email. Please try again later."
                });
            }
        })
        .RequireAuthorization();

        // START EXAM
        group.MapPost("/start-exam/{token}", async (
            string token,
            [FromServices] ICandidateService service
        ) =>
        {
            var result = await service.StartExam(token);

            if (!result.Success)
                return Results.BadRequest(result.Error);

            return Results.Ok(result); // result.Data
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

        //exam review
        group.MapGet("/{id:int}/exam-review", async (
            int id,
            ICandidateService service
        ) =>
        {
            var result = await service.GetExamReview(id);

            if (result == null)
            {
                return Results.Ok(new
                {
                    message = "No exam assigned yet",
                    candidateId = id,
                    questions = new List<object>()
                });
            }

            return Results.Ok(result);
        })
        .RequireAuthorization();

    }
}


    
