namespace HireGate.API.Contracts;

public class ApiErrorResponse
{
    public bool Success { get; set; } = false;
    public string Error { get; set; } = string.Empty;
}