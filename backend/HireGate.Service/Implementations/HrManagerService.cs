

using HireGate.Repository.Interfaces;
using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Data.Models;

using Microsoft.Extensions.Configuration;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BCrypt.Net;

namespace HireGate.Service.Implementations
{
public class AdminService : IAdminService
{
    private readonly IAdminRepository _repo;
    private readonly IConfiguration _config;
    private readonly IEmailService _email;

public AdminService(IAdminRepository repo, IConfiguration config, IEmailService email)
{
    _repo = repo;
    _config = config;
    _email = email;
}

    // GET ALL
    public async Task<(List<AdminResponseDto> Data, int TotalCount)> GetAll(int page, int pageSize, string? search)
    {
        var validPage = Math.Max(1, page);
        var validPageSize = Math.Min(Math.Max(1, pageSize), 100);
        var (admins, totalCount) = await _repo.GetAll(validPage, validPageSize, search);

        var data = admins.Select(a => new AdminResponseDto
        {
            Id = a.Id,
            FirstName = a.FirstName,
            LastName = a.LastName,
            Email = a.Email,
            Role = a.Role.ToString(),
        }).ToList();

        return (data, totalCount);
    }

    // GET BY ID
    public async Task<AdminResponseDto?> GetById(int id)
    {
        var admin = await _repo.GetById(id);

        if (admin == null)
            return null;

        return new AdminResponseDto
        {
            Id = admin.Id,
            Email = admin.Email,
            Role = admin.Role.ToString()
        };
    }

    // CREATE ADMIN
    public async Task<CreateAdminResponseDto> CreateAdmin(CreateAdminRequestDto dto)
    {
            var existing = await _repo.GetByEmail(dto.Email);

        if (existing != null)
    {
        return new CreateAdminResponseDto
        {
            Id = 0,
            Email = dto.Email,
            Role = "",
            Message = "Email already exists"
        };
    }

        var admin = new Admin
        {
            Email = dto.Email,
            Role = (UserRole)dto.Role,
            FirstName = null,
            LastName = null,
            PasswordHash = null
        };

        await _repo.Add(admin);

        return new CreateAdminResponseDto
        {
            Id = admin.Id,
            Email = admin.Email,
            Role = admin.Role.ToString(),
            Message = "Admin created successfully"
        };
    }

    // DELETE ADMIN
    public async Task<DeleteAdminResponseDto> Delete(int id)
    {
        var admin = await _repo.GetById(id);

        if (admin == null)
        {
            return new DeleteAdminResponseDto
            {
                Success = false,
                Message = "Admin not found"
            };
        }

    // prevent deleting last CEO
    if (admin.Role == UserRole.CEO)
    {
        var ceoCount = await _repo.CountByRole(UserRole.CEO);

        if (ceoCount <= 1)
            return new DeleteAdminResponseDto
            {
                Success = false,
                Message = "Cannot delete last CEO"
            };
    }
    
        await _repo.Delete(admin);

        return new DeleteAdminResponseDto
        {
            Success = true,
            Message = "Admin deleted successfully"
        };
    }

    // UPDATE ROLE
public async Task<UpdateAdminRoleResponseDto> UpdateRole(int id, UpdateAdminRoleDto dto)
{
    var admin = await _repo.GetById(id);

    if (admin == null)
    {
        return new UpdateAdminRoleResponseDto
        {
            Id = id,
            Role = "",
            Message = "Admin not found"
        };
    }

    // safe enum conversion
    if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
    {
        return new UpdateAdminRoleResponseDto
        {
            Id = id,
            Role = "",
            Message = "Invalid role"
        };
    }

    admin.Role = role;

    await _repo.Update(admin);

    return new UpdateAdminRoleResponseDto
    {
        Id = admin.Id,
        Role = admin.Role.ToString(),
        Message = "Role updated successfully"
    };
}


private string GenerateOtp()
{
    var bytes = new byte[4];
    System.Security.Cryptography.RandomNumberGenerator.Fill(bytes);
    var number = BitConverter.ToUInt32(bytes, 0) % 900000 + 100000;
    return number.ToString();
}

public async Task ForgotPassword(ForgotPasswordDto dto)
{
    var admin = await _repo.GetByEmail(dto.Email);

    if (admin == null)
        return;

    var otp = GenerateOtp();
    Console.WriteLine("============== OTP DEBUG ==============");
    Console.WriteLine($"Email: {admin.Email}");
    Console.WriteLine($"OTP: {otp}");
    Console.WriteLine("=======================================");
    
    admin.ResetOtpHash = BCrypt.Net.BCrypt.HashPassword(otp);
    admin.ResetOtpExpiry = DateTime.UtcNow.AddMinutes(3);

    await _repo.Update(admin);

    await _email.SendEmail(
        admin.Email!,
        "Your OTP Code",
        $"Your OTP is: {otp}\nExpires in 3 minutes."
    );
}


public async Task<bool> ResetPassword(ResetPasswordDto dto)
{
    var admin = await _repo.GetByEmail(dto.Email);

    if (admin == null)
        return false;

    // check OTP expiry
    if (admin.ResetOtpExpiry == null || admin.ResetOtpExpiry < DateTime.UtcNow)
        return false;

    // check OTP exists
    if (string.IsNullOrEmpty(admin.ResetOtpHash))
        return false;

    // validate OTP HERE (only place)
    bool isValid = BCrypt.Net.BCrypt.Verify(dto.Otp, admin.ResetOtpHash);

    if (!isValid)
        return false;

    // check password match
    if (dto.NewPassword != dto.ConfirmPassword)
        return false;

    // update password
    admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

    // clear OTP data
    admin.ResetOtpHash = null;
    admin.ResetOtpExpiry = null;

    await _repo.Update(admin);

    return true;
}


}
}