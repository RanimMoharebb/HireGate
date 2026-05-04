namespace HireGate.Service.DTOs;
public class ResetPasswordDto
{
    public required string Email { get; set; }
    public required string Otp { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}