namespace HireGate.Service.DTOs;

public class SendBulkExamEmailDto
{
    public int ExamId { get; set; }
    public int? FinalScore { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public List<int> CandidateIds { get; set; } = new();
}