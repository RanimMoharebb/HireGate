namespace HireGate.Service.DTOs;

public class CandidateExamReviewQuestionDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public List<CandidateExamReviewChoiceDto> Choices { get; set; } = [];
}
