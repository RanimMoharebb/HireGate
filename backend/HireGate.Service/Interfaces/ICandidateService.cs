using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{

public interface ICandidateService
{
    Task<List<CandidateResponseDto>> GetAll();
    Task<CandidateResponseDto?> GetById(int id);

    Task<CreateCandidateResponseDto> CreateCandidate(CreateCandidateDto dto);

    Task<DeleteCandidateResponseDto?> Delete(int id);

    Task<string> SendExamEmail(SendExamEmailDto dto);
    Task<string> SendBulkExamEmail(SendBulkExamEmailDto dto);
    Task<CompleteCandidateProfileResponseDto?> CompleteProfile(string token, CompleteCandidateProfileDto dto);

    Task<ExamPageDto?> GetExamPage(string token);

   // Task<StartExamResponseDto?> StartExam(StartExamDto dto);
    Task<object> StartExam(StartExamDto dto);}
}