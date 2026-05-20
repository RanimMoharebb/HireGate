using HireGate.ResultWrapper;
using HireGate.API.Contracts;
using Microsoft.AspNetCore.Http;

namespace HireGate.API.Mapping;

public static class ApiResponseMapper
{
    public static IResult ToHttpResult<T>(ServiceResult<T> result)
    {
        if (result.Success)
        {
            return Results.Ok(ApiResponse<T>.Ok(result.Data!));
        }

        var message = result.Error ?? "Unknown error";

        if (message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            return Results.NotFound(ApiResponse<T>.Fail(message));

        if (message.Contains("unauthorized", StringComparison.OrdinalIgnoreCase))
            return Results.Unauthorized();

        return Results.BadRequest(ApiResponse<T>.Fail(message));
    }

    // for validation / manual errors
    public static IResult Fail(string message, int statusCode = 400)
    {
        return statusCode switch
        {
            400 => Results.BadRequest(ApiResponse<string>.Fail(message)),
            404 => Results.NotFound(ApiResponse<string>.Fail(message)),
            401 => Results.Unauthorized(),
            _ => Results.BadRequest(ApiResponse<string>.Fail(message))
        };
    }

    // for simple success (no ServiceResult cases)
    public static IResult Success<T>(T data)
    {
        return Results.Ok(ApiResponse<T>.Ok(data));
    }
}