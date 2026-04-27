using System.ComponentModel.DataAnnotations;
namespace backend.HireGate.Data.Models;

public class ExamQuestion
{
    public int ExamId { get; set; }
    public int QuestionId { get; set; }

    public Exam Exam { get; set; } = null!;
    public Question Question { get; set; } = null!;
}