using System.ComponentModel.DataAnnotations;

public class Question
{
    [Key]
    public int Id { get; set; }
    public string? Topic { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? QuestionImage { get; set; }
    public ICollection<Choice> Choices { get; set; } = new List<Choice>();
    public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
}