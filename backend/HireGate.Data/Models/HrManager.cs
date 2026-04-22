using System.ComponentModel.DataAnnotations;
public class HrManager
{
    [Key]
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}