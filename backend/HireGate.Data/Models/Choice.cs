using System.ComponentModel.DataAnnotations;
namespace backend.HireGate.Data.Models;

public class Choice
{
    [Key]
    public int Id { get; set; }
    public int QuestionId { get; set; }
    [MaxLength(100)]

    public string ChoiceText { get; set; } = null!;
    public bool IsCorrect { get; set; }

    public Question Question { get; set; } = null!;
}