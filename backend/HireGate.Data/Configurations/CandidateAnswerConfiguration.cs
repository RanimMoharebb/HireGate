using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HireGate.Data.Models;

namespace HireGate.Data.Configurations;

public class CandidateAnswerConfiguration : IEntityTypeConfiguration<CandidateAnswer>
{
    public void Configure(EntityTypeBuilder<CandidateAnswer> builder)
    {
        builder.ToTable("candidate_answers");

        builder.HasKey(ca => ca.Id);
        builder.Property(ca => ca.Id).HasColumnName("id");
        builder.Property(ca => ca.CandidateId).HasColumnName("candidate_id");
        builder.Property(ca => ca.ExamId).HasColumnName("exam_id");
        builder.Property(ca => ca.QuestionId).HasColumnName("question_id");
        builder.Property(ca => ca.ChoiceId).HasColumnName("choice_id");
        builder.Property(ca => ca.IsCorrect).HasColumnName("is_correct");

        builder.HasIndex(ca => new { ca.CandidateId, ca.ExamId }).HasDatabaseName("IX_CandidateAnswers_Candidate_Exam");
    }
}
