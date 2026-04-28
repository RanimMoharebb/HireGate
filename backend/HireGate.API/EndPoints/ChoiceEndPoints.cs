using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;

namespace HireGate.API.Endpoints
{
    public static class ChoiceEndpoints
    {
        public static void MapChoiceEndpoints(this WebApplication app, IServiceProvider serviceProvider)
        {
            var group = app.MapGroup("/api/admin/questions/{questionId}/choices")
                .WithName("Choices");
  
            group.MapPost("/", AddChoice)
                .WithName("AddChoice");

            group.MapPut("/{choiceId}", UpdateChoice)
                .WithName("UpdateChoice");

            group.MapPatch("/{choiceId}", PatchChoice)
                .WithName("PatchChoice");
                
            group.MapDelete("/{choiceId}", DeleteChoice)
                .WithName("DeleteChoice");
        }

        private static async Task<IResult> AddChoice(int questionId, CreateChoiceDto choice, IChoiceService choiceService)
        {
            try
            {
                var createdChoice = await choiceService.AddChoiceAsync(questionId, choice);
                return Results.Created($"/api/admin/questions/{questionId}/choices/{createdChoice.Id}", createdChoice);
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }

        private static async Task<IResult> UpdateChoice(int questionId, int choiceId, UpdateChoiceDto choice, IChoiceService choiceService)
        {
            try
            {
                var updatedChoice = await choiceService.UpdateChoiceAsync(questionId, choiceId, choice);
                return Results.Ok(updatedChoice);
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }

        private static async Task<IResult> PatchChoice(int questionId, int choiceId, PatchChoiceDto choice, IChoiceService choiceService)
        {
            try
            {
                var patchedChoice = await choiceService.PatchChoiceAsync(questionId, choiceId, choice);
                return Results.Ok(patchedChoice);
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }

        private static async Task<IResult> DeleteChoice(int questionId, int choiceId, IChoiceService choiceService)
        {
            try
            {
                var success = await choiceService.DeleteChoiceAsync(questionId, choiceId);
                if (!success)
                    return Results.NotFound(new { message = $"Choice with ID {choiceId} not found in question {questionId}" });

                return Results.NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }
    }
}
