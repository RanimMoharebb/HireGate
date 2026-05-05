using System.ComponentModel.DataAnnotations;
namespace HireGate.Data.Models;

public class Exam
{
    [Key]
    public int Id { get; set; }

    [MaxLength(100)]
    public string? PositionTitle { get; set; }

    [Range(0, 100)]
    public int? DurationMinutes { get; set; }
    public DateTime? WindowStartTime { get; set; }
    public DateTime? WindowEndTime { get; set; }
    
    public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
    public ICollection<Candidate> Candidates { get; set; } = new List<Candidate>();
}
