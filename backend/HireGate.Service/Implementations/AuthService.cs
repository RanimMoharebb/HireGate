
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HireGate.Repository.Interfaces;
using HireGate.Service.Interfaces;
using Microsoft.Extensions.Configuration;
using HireGate.Service.DTOs;
using BCrypt.Net;
using HireGate.Data.Models;

namespace HireGate.Service.Implementations
{
public class AuthService : IAuthService
{
    private readonly IAdminRepository _repo;
    private readonly IConfiguration _config;
    private readonly IEmailService _email; // extra

public AuthService(IAdminRepository repo, IConfiguration config, IEmailService email)
{
    _repo = repo;
    _config = config;
    _email = email; // extra
}

    public async Task<LoginResponseDto> Login(string email, string password)
{
    var admin = await _repo.GetByEmail(email);

    if (admin == null)
    {
        return new LoginResponseDto
        {
            Token = "",
            Message = "Invalid credentials"
        };
    }

    var isValid = BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash);

     if (!isValid)
    {
        return new LoginResponseDto
        {
            Token = "",
            Message = "Invalid credentials"
        };
    }
    var token = GenerateJwt(admin);

    return new LoginResponseDto
    {
        Token = token,
        Message = "Login successful"
    };
}

private string GenerateJwt(Admin admin)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
        new Claim(ClaimTypes.Email, admin.Email ?? ""),
        new Claim(ClaimTypes.Role, admin.Role.ToString())
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
    );

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2), // do not want expiry to token
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

public async Task<CompleteRegisterAdminResponseDto> CompleteRegistration(CompleteRegisterAdminDto dto)
{
    var admin = await _repo.GetByEmail(dto.Email);

        if (admin == null)
    {
        return new CompleteRegisterAdminResponseDto
        {
            Message = "Admin not found"
        };
    }

        if (admin.PasswordHash != null)
    {
        return new CompleteRegisterAdminResponseDto
        {
            Message = "Already registered"
        };
    }

    // update fields
    admin.FirstName = dto.FirstName;
    admin.LastName = dto.LastName;

    // hash password
    admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

    // save changes
    await _repo.Update(admin);

    return new CompleteRegisterAdminResponseDto
    {
        Message = "Registration completed successfully"
    };
}


}
}