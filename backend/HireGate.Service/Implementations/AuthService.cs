
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
using HireGate.ResultWrapper;

namespace HireGate.Service.Implementations
{
public class AuthService : IAuthService
{
    private readonly IAdminRepository _repo;
    private readonly IConfiguration _config;
    private readonly IEmailService _email; // extra
    private readonly IDateTimeProvider _dateTimeProvider;

public AuthService(IAdminRepository repo, IConfiguration config, IEmailService email, IDateTimeProvider dateTimeProvider)
{
    _repo = repo;
    _config = config;
    _email = email; // extra
    _dateTimeProvider = dateTimeProvider;
}

    public async Task<ServiceResult<LoginResponseDto>> Login(string email, string password)
{
    var admin = await _repo.GetByEmail(email);

    if (admin == null)
    {
        return ServiceResult<LoginResponseDto>.Fail("Invalid credentials");
    }

    var isValid = BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash);

     if (!isValid)
    {
        return ServiceResult<LoginResponseDto>.Fail("Invalid credentials");
    }
    
    var token = GenerateJwt(admin);

    return ServiceResult<LoginResponseDto>.Ok(new LoginResponseDto
    {
        Token = token,
        Message = "Login successful"
    });
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
        expires: _dateTimeProvider.Now.AddHours(2),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

public async Task<ServiceResult<bool>> CompleteRegistration(CompleteRegisterAdminDto dto)
{
    var admin = await _repo.GetByEmail(dto.Email);

        if (admin == null)
    {
        return ServiceResult<bool>.Fail("Admin not found");
    }

        if (admin.PasswordHash != null)
    {
        return ServiceResult<bool>.Fail("Already registered");
    }

    // update fields
    admin.FirstName = dto.FirstName;
    admin.LastName = dto.LastName;

    // hash password
    admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

    // save changes
    await _repo.Update(admin);

    return ServiceResult<bool>.Ok(true);
}


}
}