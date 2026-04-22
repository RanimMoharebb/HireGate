using System.ComponentModel.DataAnnotations;

public class Exam
{
    [Key]
    public int Id { get; set; }
    public int HrManagerId { get; set; }
    public string? PositionTitle { get; set; }
    public int? DurationMinutes { get; set; }
    public DateTime? WindowStartTime { get; set; }
    public DateTime? WindowEndTime { get; set; }
    public HrManager HrManager { get; set; } = null!;
    public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
    public ICollection<ExamSession> ExamSessions { get; set; } = new List<ExamSession>();
}