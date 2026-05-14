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

    public async Task<(List<Admin> Items, int TotalCount)> GetAll(int page, int pageSize, string? search)
    {
        var query = _context.Admins.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(a =>
                a.Email.ToLower().Contains(term) ||
                (a.FirstName != null && a.FirstName.ToLower().Contains(term)) ||
                (a.LastName != null && a.LastName.ToLower().Contains(term)));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<int> CountByRole(UserRole role)
    {
        return await _context.Admins.CountAsync(a => a.Role == role);
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