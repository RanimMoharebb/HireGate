using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HireGate.Data.Models;

namespace HireGate.Data.Configurations;

public class TopicConfiguration : IEntityTypeConfiguration<Topic>
{
    public void Configure(EntityTypeBuilder<Topic> builder)
    {
        builder.ToTable("topics");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("topic_id");

        builder.Property(t => t.TopicName)
            .HasColumnName("topic_name")
            .HasMaxLength(30)
            .IsRequired();

        builder.HasIndex(t => t.TopicName).HasDatabaseName("IX_Topics_TopicName");
    }
}
