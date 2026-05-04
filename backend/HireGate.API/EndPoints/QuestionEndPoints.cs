using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
using System;
using System.Linq;
using System.Collections.Generic;
namespace HireGate.API.Endpoints
{
    public static class QuestionEndpoints
    {
        public static void MapQuestionEndpoints(this WebApplication app, IServiceProvider serviceProvider)
        {
            var adminGroup = app.MapGroup("/api/admin/questions")
                .WithName("Questions");

            adminGroup.MapGet("/", GetAllQuestions)
                .WithName("GetAllQuestions");

            adminGroup.MapGet("/{id}", GetQuestionById)
                .WithName("GetQuestionById");

            adminGroup.MapGet("/topic/{topicId}", GetQuestionsByTopicId)
                .WithName("GetQuestionsByTopicId");

            adminGroup.MapPost("/", CreateQuestion)
                .WithName("CreateQuestion");

            adminGroup.MapPut("/{id}", UpdateQuestion)
                .WithName("UpdateQuestion");

            adminGroup.MapPatch("/{id}", PatchQuestion)
                .WithName("PatchQuestion");

            adminGroup.MapDelete("/{id}", DeleteQuestion)
                .WithName("DeleteQuestion");
        }

        private static async Task<IResult> GetAllQuestions(IQuestionService questionService, int page = 1, int pageSize = 10)
        {
            try
            {
                var validPage = Math.Max(1, page);
                var validPageSize = Math.Min(Math.Max(1, pageSize), 100);

                var (questions, totalCount) = await questionService.GetAllQuestionsAsync(validPage, validPageSize);

                var totalPages = validPageSize == 0 ? 0 : (int)Math.Ceiling((double)totalCount / validPageSize);

                var result = new
                {
                    data = questions,
                    page = validPage,
                    pageSize = validPageSize,
                    totalCount,
                    totalPages
                };

                return Results.Ok(result);
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

        private static async Task<IResult> GetQuestionById(int id, IQuestionService questionService)
        {
            try
            {
                var question = await questionService.GetQuestionByIdAsync(id);
                if (question == null)
                    return Results.NotFound(new { message = $"Question with ID {id} not found" });

                return Results.Ok(question);
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

        private static async Task<IResult> GetQuestionsByTopicId(int topicId, IQuestionService questionService)
        {
            try
            {
                var questions = await questionService.GetQuestionsByTopicIdAsync(topicId);
                return Results.Ok(questions);
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

        private static async Task<IResult> CreateQuestion(CreateQuestionDto question, IQuestionService questionService)
        {
            try
            {
                var createdQuestion = await questionService.CreateQuestionAsync(question);
                return Results.CreatedAtRoute("GetQuestionById", new { id = createdQuestion.Id }, createdQuestion);
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

        private static async Task<IResult> UpdateQuestion(int id, UpdateQuestionDto question, IQuestionService questionService)
        {
            try
            {
                var updatedQuestion = await questionService.UpdateQuestionAsync(id, question);
                return Results.Ok(updatedQuestion);
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

        private static async Task<IResult> PatchQuestion(int id, PatchQuestionDto question, IQuestionService questionService)
        {
            try
            {
                var patchedQuestion = await questionService.PatchQuestionAsync(id, question);
                return Results.Ok(patchedQuestion);
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

        private static async Task<IResult> DeleteQuestion(int id, IQuestionService questionService)
        {
            try
            {
                var success = await questionService.DeleteQuestionAsync(id);
                if (!success)
                    return Results.NotFound(new { message = $"Question with ID {id} not found" });

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
