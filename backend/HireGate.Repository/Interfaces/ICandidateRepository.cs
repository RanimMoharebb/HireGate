using HireGate.Data.Context;
using HireGate.Data.Models;
// using HireGate.Service.DTOs;

namespace HireGate.Repository.Interfaces
{

public interface ICandidateRepository
{
    Task<(List<Candidate> Items, int TotalCount)> GetAll(int page, int pageSize, string? search, string? status);
    Task<bool> ExistsByEmail(string email);
    Task<Candidate?> GetById(int id);
    Task Add(Candidate candidate);
    Task Update(Candidate candidate);
    Task<bool> Delete(int id);
    Task<Candidate?> GetByToken(string token);
    Task AssignExam(int candidateId, int examId);
    Task<Candidate?> GetCandidateWithExam(int candidateId);
}
}