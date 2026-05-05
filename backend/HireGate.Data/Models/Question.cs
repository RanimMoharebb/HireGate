using System.ComponentModel.DataAnnotations;
namespace HireGate.Data.Models;
public class Question
{
    [Key]
    public int Id { get; set; }

    public int? TopicId { get; set; }
    public Topic? Topic { get; set; }

    [MaxLength(200)]
    public string QuestionText { get; set; } = null!;

    [MaxLength(200)]
    public string? QuestionImage { get; set; }
    public ICollection<Choice> Choices { get; set; } = new List<Choice>();
    public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
}
