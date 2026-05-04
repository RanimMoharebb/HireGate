namespace HireGate.Service.DTOs;

public class CreateCandidateResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Message { get; set; } = "Candidate created";
}