using HireGate.Service.DTOs;
using HireGate.ResultWrapper; 

namespace HireGate.Service.Interfaces
{

public interface IAdminService
{
    Task<ServiceResult<PagedResult<AdminResponseDto>>> GetAll(int page, int pageSize, string? search);
    Task<ServiceResult<AdminResponseDto?>> GetById(int id);

    Task<ServiceResult<CreateAdminResponseDto>> CreateAdmin(CreateAdminRequestDto dto);

    Task<ServiceResult<bool>> Delete(int id);

    Task<ServiceResult<UpdateAdminRoleResponseDto>> UpdateRole(int id, UpdateAdminRoleDto dto);

    Task<ServiceResult<string>> ForgotPassword(ForgotPasswordDto dto);
    Task<ServiceResult<bool>> ResetPassword(ResetPasswordDto dto);
}

}