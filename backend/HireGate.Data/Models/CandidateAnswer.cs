using System.ComponentModel.DataAnnotations;

public class CandidateAnswer
{
    [Key]
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int ChoiceId { get; set; }
    public bool? IsCorrect { get; set; }

    public Choice Choice { get; set; } = null!;
}