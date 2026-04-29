using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HireGate.Data.Models;

namespace HireGate.Data.Configurations;

public class ChoiceConfiguration : IEntityTypeConfiguration<Choice>
{
    public void Configure(EntityTypeBuilder<Choice> builder)
    {
        builder.ToTable("choices");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("choice_id");

        builder.Property(c => c.QuestionId).HasColumnName("question_id");
        builder.Property(c => c.ChoiceText)
            .HasColumnName("choice_text")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.IsCorrect).HasColumnName("is_correct");

        builder.HasIndex(c => c.QuestionId).HasDatabaseName("IX_Choices_QuestionId");
    }
}
