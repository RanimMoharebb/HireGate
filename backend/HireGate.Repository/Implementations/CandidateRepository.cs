using HireGate.Data.Context;
using HireGate.Data.Models;
using HireGate.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _context;
    public CandidateRepository(AppDbContext context)
    {
        _context = context;
    }


    public async Task<List<Candidate>> GetAll()
    {
        return await _context.Candidates.ToListAsync();
    }


    public async Task<Candidate?> GetById(int id)
    {
        return await _context.Candidates.FindAsync(id);
    }



    public async Task Add(Candidate candidate)
    {
        await _context.Candidates.AddAsync(candidate);
        await _context.SaveChangesAsync();
    }

    

    public async Task Update(Candidate candidate)
    {
        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();
    }


    
    public async Task<bool> Delete(int id)
    {
        var candidate = await _context.Candidates.FindAsync(id);

        if (candidate == null)
            return false;

        _context.Candidates.Remove(candidate);
        await _context.SaveChangesAsync();

        return true;
    }


    public async Task<Candidate?> GetByToken(string token)
    {
        return await _context.Candidates
            .Include(c => c.Exam)
                .ThenInclude(e => e.ExamQuestions)
                    .ThenInclude(eq => eq.Question)
                        .ThenInclude(q => q.Choices)
            .FirstOrDefaultAsync(c => c.Token == token);
    }



    public async Task<bool> ExistsByEmail(string email)
    {
        return await _context.Candidates
            .AnyAsync(c => c.Email == email);
    }

    public async Task AssignExam(int candidateId, int examId)
    {
        await _context.Candidates
            .Where(c => c.Id == candidateId)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(c => c.ExamId, examId));
    }

}