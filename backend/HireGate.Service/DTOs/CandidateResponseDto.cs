namespace HireGate.Service.DTOs;

public class CandidateResponseDto
{
    public int Id { get; set; }

    public int? ExamId { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? Token { get; set; }

    public DateTime? StartedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }

    public int? FinalScore { get; set; }
}