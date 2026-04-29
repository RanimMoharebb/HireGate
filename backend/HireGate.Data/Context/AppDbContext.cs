using Microsoft.EntityFrameworkCore;
using HireGate.Data.Models;
namespace HireGate.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<Topic> Topics => Set<Topic>();
        public DbSet<Candidate> Candidates => Set<Candidate>();
        public DbSet<Question> Questions => Set<Question>();
        public DbSet<Choice> Choices => Set<Choice>();
        public DbSet<Exam> Exams => Set<Exam>();
        public DbSet<CandidateAnswer> CandidateAnswers => Set<CandidateAnswer>();

        public DbSet<ExamQuestion> ExamQuestions => Set<ExamQuestion>();

       
       protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            modelBuilder.Entity<ExamQuestion>()
                .HasKey(eq => new { eq.ExamId, eq.QuestionId });
        }
    }
}
