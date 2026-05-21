namespace HireGate.Service.DTOs;

public class SendBulkExamEmailDto
{
    public int ExamId { get; set; }
    public List<int> CandidateIds { get; set; } = new();
}