using System.ComponentModel.DataAnnotations;

public class Candidate
{
    [Key]
    public int Id { get; set; }
    public string? FirstName { get; set; } 
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }

    // Navigation property
    public ICollection<ExamSession> ExamSessions { get; set; } = new List<ExamSession>();
}