using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HireGate.Data.Models;

namespace HireGate.Data.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("questions");

        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id).HasColumnName("question_id");

        builder.Property(q => q.TopicId).HasColumnName("topic_id");
        builder.Property(q => q.QuestionText)
            .HasColumnName("question_text")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(q => q.QuestionImage).HasColumnName("question_image");
        builder.HasOne(q => q.Topic)          
            .WithMany(t => t.Questions)      
            .HasForeignKey(q => q.TopicId)    
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(q => q.TopicId).HasDatabaseName("IX_Questions_TopicId");
    }
}
