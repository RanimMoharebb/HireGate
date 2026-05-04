namespace HireGate.Service.DTOs;

public class CreateAdminResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Message { get; set; } = "Admin created successfully";
}