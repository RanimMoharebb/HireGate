using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;
namespace HireGate.API.Endpoints;


    public static class ExamEndpoints
    {
        public static void MapExamEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/exam");

            // ────────────────────────────────────────────────────────
            // GET all exams
            // ────────────────────────────────────────────────────────

            group.MapGet("/", async (IExamService examService) =>
                {
                var exams = await examService.GetAllExamsAsync();
                return Results.Ok(exams);
                });

            // ────────────────────────────────────────────────────────
            // GET Exam by id
            // ────────────────────────────────────────────────────────

            group.MapGet("/{id:int}", async (int id, IExamService examService) =>
                {
                var exam = await examService.GetExamByIdAsync(id);

                return exam is null
                    ? Results.NotFound()
                    : Results.Ok(exam);
                });

            // ────────────────────────────────────────────────────────
            // Create Exam
            // ────────────────────────────────────────────────────────

            group.MapPost("/", async (
                CreateExamDto examDto,
                IExamService examService,
                IValidator<CreateExamDto> validator) =>
                {
                    // result is an object, we have to check on its isValid property
                    var result = await validator.ValidateAsync(examDto);

                    if(!result.IsValid)
                     {
                        return Results.BadRequest(result.Errors.Select(e => new
                    {
                            field = e.PropertyName,
                            error = e.ErrorMessage
                    }));
                    }

                    var createdExam = await examService.CreateExamAsync(examDto);
                    return Results.Created($"/api/exam/{createdExam.Id}", createdExam);
                });

            // ────────────────────────────────────────────────────────
            // Update Exam
            // ────────────────────────────────────────────────────────

            group.MapPut("/{id:int}", async (
            int id,
            UpdateExamDto examDto,
            IExamService examService,
            IValidator<UpdateExamDto> validator) =>
            {
                var result = await validator.ValidateAsync(examDto);

                if(!result.IsValid)
                {
                return Results.BadRequest(result.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    error = e.ErrorMessage
                }));
                }

                var updatedExam = await examService.UpdateExamAsync(id, examDto);

                return updatedExam is null
                    ? Results.NotFound()
                    : Results.Ok(updatedExam);
            });

            // ────────────────────────────────────────────────────────
            // Delete Exam
            // ────────────────────────────────────────────────────────

            group.MapDelete("/{id:int}", async (int id, IExamService examService) =>
                {
                var success = await examService.DeleteExamAsync(id);

                return success
                    ? Results.NoContent()
                    : Results.NotFound();
                });
            
            // Question management within exams API Endpoints
            
            // ────────────────────────────────────────────────────────
            // GET  /api/exam/{id}/questions
            // Returns all questions that belong to an exam
            // ────────────────────────────────────────────────────────

            group.MapGet("/{id:int}/questions", 
            async (int id, IExamService examService) => 
            { 
                var exam = await examService.GetExamByIdAsync(id);
                 if (exam is null) 
                 return Results.NotFound();
                 return Results.Ok(exam.Questions); 
            });
            
            // ────────────────────────────────────────────────────────
            // POST  /api/exam/{id}/questions/{questionId}
            // Adds an existing question to an exam
            // ────────────────────────────────────────────────────────

            group.MapPost("/{id:int}/questions/{questionId:int}", async (
                int id,
                int questionId,
                IExamService examService) =>
            {
                var exam = await examService.GetExamByIdAsync(id);

                if (exam is null)
                    return Results.NotFound($"Exam with ID {id} not found.");

                var success = await examService.AddQuestionToExamAsync(id, questionId);

                return success
                    ? Results.Ok($"Question {questionId} added to Exam {id}.")
                    : Results.BadRequest($"Failed to add Question {questionId}.");
            });

            // ────────────────────────────────────────────────────────
            // DELETE  /api/exam/{id}/questions/{questionId}
            // Removes a question from an exam (does NOT delete the question itself)
            // ────────────────────────────────────────────────────────

            group.MapDelete("/{id:int}/questions/{questionId:int}", async (
                int id,
                int questionId,
                IExamService examService) =>
            {
                var exam = await examService.GetExamByIdAsync(id);

                if (exam is null)
                    return Results.NotFound($"Exam with ID {id} not found.");

                var success = await examService.RemoveQuestionFromExamAsync(id, questionId);

                return success
                    ? Results.Ok($"Question {questionId} removed from Exam {id}.")
                    : Results.BadRequest($"Failed to remove Question {questionId}.");
            });

            // ────────────────────────────────────────────────────────
            // Submit exam
            // ────────────────────────────────────────────────────────
            group.MapPost("/submit/{token}", async (
                string token,
                SubmitExamDto dto,
                IExamService examService) =>
            {
                // take token from the URL and set it on the DTO
                dto.Token = token;

                try
                {
                    await examService.SubmitExamAsync(dto);
                }
                catch (InvalidOperationException ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }

                return Results.Ok("Submission successful.");
            });
            }
    }
