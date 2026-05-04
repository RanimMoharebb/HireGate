using HireGate.Data.Models;

namespace HireGate.Repository.Interfaces
{

public interface IAdminRepository
{
    Task Add(Admin admin);
    Task<Admin?> GetByEmail(string email);
    Task<Admin?> GetById(int id);
    Task<List<Admin>> GetAll();
    Task Update(Admin admin);
    Task Delete(Admin admin);
    Task Delete(int id);
}
}