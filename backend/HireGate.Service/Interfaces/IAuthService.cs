
using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{

public interface IAuthService
{
    Task<LoginResponseDto> Login(string email, string password);

    Task<CompleteRegisterAdminResponseDto> CompleteRegistration(CompleteRegisterAdminDto dto);

}
}