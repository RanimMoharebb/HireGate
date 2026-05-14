namespace HireGate.Service.DTOs;

public class CandidateExamReviewChoiceDto
{
    public int ChoiceId { get; set; }
    public string ChoiceText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public bool IsSelectedByCandidate { get; set; }
}
