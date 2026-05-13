namespace HireGate.Service.DTOs;

public class ExamReviewChoiceDto
{
    public int Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}