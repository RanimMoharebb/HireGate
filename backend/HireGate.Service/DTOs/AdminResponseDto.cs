namespace HireGate.Service.DTOs;

public class AdminResponseDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
}
