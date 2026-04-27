using System.ComponentModel.DataAnnotations;
namespace backend.HireGate.Data.Models;

public class CandidateAnswer
{
    [Key]
    public int Id { get; set; }
    public int ExamId { get; set; }
    public int ChoiceId { get; set; }
    public bool? IsCorrect { get; set; }

    public Choice Choice { get; set; } = null!;
}