
namespace HireGate.Service.DTOs;

public class CreateAdminRequestDto
{
    public string Email { get; set; } = null!;
    public UserRoleDto Role { get; set; }
}