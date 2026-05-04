namespace HireGate.Service.DTOs;

public class UpdateAdminRoleResponseDto
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = "Role updated successfully";
}