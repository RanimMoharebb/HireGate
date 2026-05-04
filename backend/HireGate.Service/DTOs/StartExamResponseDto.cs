namespace HireGate.Service.DTOs;

/*
public class StartExamResponseDto
{
    public DateTime StartedAt { get; set; }
    public string Message { get; set; } = "Exam started successfully";
}
*/

public class StartExamResponseDto
{
    public DateTime StartedAt { get; set; }

    public int ExamId { get; set; }
    public string? PositionTitle { get; set; }
    public int? DurationMinutes { get; set; }

    public string Message { get; set; } = "Exam started successfully";
    public List<ExamQuestionDto> Questions { get; set; } = new();

}