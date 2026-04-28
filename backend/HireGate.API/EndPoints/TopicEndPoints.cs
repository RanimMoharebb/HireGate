using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using FluentValidation;


namespace HireGate.API.Endpoints
{
    public static class TopicEndpoints
    {
        public static void MapTopicEndpoints(this WebApplication app, IServiceProvider serviceProvider)
        {
            var group = app.MapGroup("/api/admin/topics")
                .WithName("Topics");

            group.MapGet("/", GetAllTopics)
                .WithName("GetAllTopics");

            group.MapGet("/{id}", GetTopicById)
                .WithName("GetTopicById");

            group.MapPost("/", CreateTopic)
                .WithName("CreateTopic");

            group.MapPut("/{id}", UpdateTopic)
                .WithName("UpdateTopic");

            group.MapDelete("/{id}", DeleteTopic)
                .WithName("DeleteTopic");
        }

        private static async Task<IResult> GetAllTopics(ITopicService topicService)
        {
            try
            {
                var topics = await topicService.GetAllTopicsAsync();
                return Results.Ok(topics);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }

        private static async Task<IResult> GetTopicById(int id, ITopicService topicService)
        {
            try
            {
                var topic = await topicService.GetTopicByIdAsync(id);
                if (topic == null)
                    return Results.NotFound(new { message = $"Topic with ID {id} not found" });

                return Results.Ok(topic);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }

        private static async Task<IResult> CreateTopic(CreateUpdateTopicDto topic, ITopicService topicService)
        {
            try
            {
                var createdTopic = await topicService.CreateTopicAsync(topic);
                return Results.CreatedAtRoute("GetTopicById", new { id = createdTopic.Id }, createdTopic);
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

        private static async Task<IResult> UpdateTopic(int id, CreateUpdateTopicDto topic, ITopicService topicService)
        {
            try
            {
                var updatedTopic = await topicService.UpdateTopicAsync(id, topic);
                return Results.Ok(updatedTopic);
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

        private static async Task<IResult> DeleteTopic(int id, ITopicService topicService)
        {
            try
            {
                var success = await topicService.DeleteTopicAsync(id);
                if (!success)
                    return Results.NotFound(new { message = $"Topic with ID {id} not found" });

                return Results.NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }
    }
}
