using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{

public interface ICandidateService
{
    Task<(List<CandidateResponseDto> Data, int TotalCount)> GetAll(int page, int pageSize, string? search);
    Task<CandidateResponseDto?> GetById(int id);

    Task<CreateCandidateResponseDto> CreateCandidate(CreateCandidateDto dto);

    Task<DeleteCandidateResponseDto?> Delete(int id);

    Task<string> SendExamEmail(SendExamEmailDto dto);
    Task<string> SendBulkExamEmail(SendBulkExamEmailDto dto);
    Task<CompleteCandidateProfileResponseDto?> CompleteProfile(string token, CompleteCandidateProfileDto dto);

    Task<ExamPageDto?> GetExamPage(string token);

    Task<object> StartExam(string token);
    
    }
}