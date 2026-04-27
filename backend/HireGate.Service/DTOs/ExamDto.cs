namespace backend.HireGate.Service.DTOs;

public class ExamDto
{
    public int Id { get; set; }
    public required string PositionTitle { get; set; }
    public int? DurationMinutes { get; set; }

    public DateTime? WindowStartTime { get; set; }
    public DateTime? WindowEndTime { get; set; }
    public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }
