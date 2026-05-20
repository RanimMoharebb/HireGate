
using HireGate.Service.DTOs;
using HireGate.ResultWrapper;

namespace HireGate.Service.Interfaces
{

public interface IAuthService
{
    Task<ServiceResult<LoginResponseDto>> Login(string email, string password);

    Task<ServiceResult<bool>> CompleteRegistration(CompleteRegisterAdminDto dto);

}
}