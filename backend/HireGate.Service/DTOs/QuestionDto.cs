namespace HireGate.Service.DTOs;
public class QuestionDto
{
    public int Id { get; set; }
    public int? TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public required string QuestionText { get; set; }
    public string? QuestionImage { get; set; } 
    public required List<ChoiceDto> Choices { get; set; }
}
