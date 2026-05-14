namespace HireGate.Service.DTOs;

public class CandidateExamReviewDto
{
    public int CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public int? ExamId { get; set; }
    public string ExamTitle { get; set; } = string.Empty;
    public int? FinalScore { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public List<CandidateExamReviewQuestionDto> Questions { get; set; } = [];
}
