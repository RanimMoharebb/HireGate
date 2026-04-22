using System.ComponentModel.DataAnnotations;
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
    public string PasswordHash { get; set; } = null!;

    public enum UserRole { HRManager, Manager }

    public UserRole Role { get; set; } = UserRole.HRManager;

    
}