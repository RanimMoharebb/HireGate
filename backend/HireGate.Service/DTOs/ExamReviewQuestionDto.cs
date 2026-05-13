namespace HireGate.Service.DTOs;

public class ExamReviewQuestionDto
{
    public int QuestionId { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public int? SelectedChoiceId { get; set; }

    public bool IsCorrect { get; set; }

    public List<ExamReviewChoiceDto> Choices { get; set; } = [];
}