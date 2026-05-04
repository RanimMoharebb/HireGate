using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{

public interface IAdminService
{
    Task<List<AdminResponseDto>> GetAll();
    Task<AdminResponseDto?> GetById(int id);

    Task<CreateAdminResponseDto> CreateAdmin(CreateAdminRequestDto dto);

    Task<DeleteAdminResponseDto> Delete(int id);

    Task<UpdateAdminRoleResponseDto> UpdateRole(int id, UpdateAdminRoleDto dto);

    Task ForgotPassword(ForgotPasswordDto dto);
    Task<bool> ResetPassword(ResetPasswordDto dto);
}

}