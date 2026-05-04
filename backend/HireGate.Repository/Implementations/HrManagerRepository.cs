using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireGate.Repository.Implementations
{

public class HrManagerRepository : IAdminRepository
{
    private readonly AppDbContext _context;

    public HrManagerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task Add(Admin admin)
    {
        await _context.Admins.AddAsync(admin);
        await _context.SaveChangesAsync();
    }

    public async Task<Admin?> GetByEmail(string email)
    {
        return await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
    }

    public async Task<List<Admin>> GetAll()
    {
        return await _context.Admins.ToListAsync();
    }

    public async Task<Admin?> GetById(int id)
    {
        return await _context.Admins.FindAsync(id);
    }

    public async Task Update(Admin admin)
    {
        _context.Admins.Update(admin);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Admin admin)
    {
        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync();
    }
    public async Task Delete(int id)
    {
        var admin = await _context.Admins.FindAsync(id);

        if (admin != null)
        {
            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
        }
    }
}
}