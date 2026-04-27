namespace backend.HireGate.Service.DTOs;
public class QuestionDto
{
    public int Id { get; set; }
    public required string QuestionText { get; set; }
    public string? QuestionImage { get; set; } 
    public required List<ChoiceDto> Choices { get; set; }
}