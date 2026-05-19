using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;

namespace HireGate.API.Endpoints
{
    public static class SubmissionEndpoints
    {
        public static void MapSubmissionEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/submission");

            group.MapPost("/submit/{token}", async (
                string token,
                SubmitExamDto dto,
                ISubmissionService submissionService) =>
            {
                dto.Token = token;

                try
                {
                    await submissionService.SubmitExamAsync(dto);
                }
                catch (InvalidOperationException ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }

                return Results.Ok("Submission successful.");
            });
        }
    }
}
