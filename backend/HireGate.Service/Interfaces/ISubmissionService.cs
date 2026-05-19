using HireGate.Service.DTOs;

namespace HireGate.Service.Interfaces
{
    public interface ISubmissionService
    {
        Task SubmitExamAsync(SubmitExamDto dto);
    }
}
