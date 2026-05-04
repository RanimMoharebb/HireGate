namespace HireGate.Service.DTOs;

public class ExamPageDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = string.Empty ;
    public string? PhoneNumber { get; set; }
    public int? ExamId { get; set; }
}