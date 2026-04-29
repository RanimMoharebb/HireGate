using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HireGate.Data.Models;

namespace HireGate.Data.Configurations;

public class AdminConfiguration : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> builder)
    {
        builder.ToTable("admins");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.FirstName).HasColumnName("first_name").HasMaxLength(50);
        builder.Property(a => a.LastName).HasColumnName("last_name").HasMaxLength(50);
        builder.Property(a => a.Email).HasColumnName("email").IsRequired().HasMaxLength(100);
        builder.Property(a => a.PasswordHash).HasColumnName("password_hash").HasMaxLength(255);

        builder.Property(a => a.Role).HasColumnName("role");

        builder.HasIndex(a => a.Email).IsUnique().HasDatabaseName("UX_Admins_Email");
    }
}
