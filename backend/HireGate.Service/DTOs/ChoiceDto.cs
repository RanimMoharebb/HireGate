namespace HireGate.Service.DTOs;

public class ChoiceDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }

    public required string ChoiceText { get; set; }
    public bool IsCorrect { get; set; }

}
