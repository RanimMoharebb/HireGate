using System.ComponentModel.DataAnnotations;
namespace HireGate.Data.Models;

    
public class Admin
{
    [Key]
    public int Id { get; set; }
    [MaxLength(50)]
    public string? FirstName { get; set; }
    [MaxLength(50)]
    public string? LastName { get; set; }
    [EmailAddress]
    public string Email { get; set; } = null!;
    [MinLength(6)]
    public string? PasswordHash { get; set; }
    public UserRole Role { get; set; }
    // public UserRole Role { get; set; } = UserRole.HRManager;
    public string? ResetOtpHash { get; set; }
    public DateTime? ResetOtpExpiry { get; set; }
    
}

