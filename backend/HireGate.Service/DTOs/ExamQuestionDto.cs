namespace HireGate.Service.DTOs;

public class ExamQuestionDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? QuestionImage { get; set; }

    public List<ExamChoiceDto> Choices { get; set; } = new();
}