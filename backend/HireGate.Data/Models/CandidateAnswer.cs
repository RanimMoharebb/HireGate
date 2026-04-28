using System.ComponentModel.DataAnnotations;
namespace HireGate.Data.Models;

public class CandidateAnswer
{
    [Key]
    public int Id { get; set; }
    
    public int CandidateId { get; set; }
    public int ExamId { get; set; }
    
    public int QuestionId { get; set; }
    public int ChoiceId { get; set; }
    public bool? IsCorrect { get; set; }
    public Candidate Candidate { get; set; } = null!;
    public Exam Exam { get; set; } = null!;
    public Question Question { get; set; } = null!;
    
    public Choice Choice { get; set; } = null!;
}
