namespace HireGate.Service.DTOs;
public class UpdateExamDto
{
    public string PositionTitle { get; set; } = null!;
    public int? DurationMinutes { get; set; }
    public DateTime? WindowStartTime { get; set; }
    public DateTime? WindowEndTime { get; set; }
    
    public List<int>? QuestionIds { get; set; }
}
