namespace HireGate.Service.DTOs;

public class BulkEmailItemResultDto
{
    public int CandidateId { get; set; }
    public string? Email { get; set; }
    public string Status { get; set; } = "";
    public string? Error { get; set; }
}
