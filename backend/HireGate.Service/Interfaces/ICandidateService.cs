using HireGate.Service.DTOs;
using HireGate.ResultWrapper;
namespace HireGate.Service.Interfaces
{

public interface ICandidateService
{
    Task<(List<CandidateResponseDto> Data, int TotalCount)> GetAll(int page, int pageSize, string? search, string? status);
    Task<CandidateResponseDto?> GetById(int id);

    Task<CreateCandidateResponseDto> CreateCandidate(CreateCandidateDto dto);

    Task<DeleteCandidateResponseDto?> Delete(int id);

    Task<string> SendExamEmail(SendExamEmailDto dto);
    Task<BulkEmailResultDto> SendBulkExamEmail(SendBulkExamEmailDto dto);
    Task<CompleteCandidateProfileResponseDto?> CompleteProfile(string token, CompleteCandidateProfileDto dto);

    Task<ExamPageDto?> GetExamPage(string token);

    Task<ServiceResult<StartExamResponseDto>> StartExam(string token);
    Task<ExamReviewDto?> GetExamReview(int candidateId);    
    }
}
