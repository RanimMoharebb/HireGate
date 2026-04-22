using System.ComponentModel.DataAnnotations;

public class ExamSession
{
    [Key]
    public int Id { get; set; }
    public int ExamId { get; set; }
    public int CandidateId { get; set; }

    public string Token { get; set; } = null!;

    public DateTime? StartedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public int? FinalScore { get; set; }

    public Exam Exam { get; set; } = null!;
    public Candidate Candidate { get; set; } = null!;

    public ICollection<CandidateAnswer> Answers { get; set; } = new List<CandidateAnswer>();
}