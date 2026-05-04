

using HireGate.Repository.Interfaces;
using HireGate.Service.Interfaces;
using HireGate.Service.DTOs;
using HireGate.Data.Models;
using System.Security.Principal;

namespace HireGate.Service.Implementations
{
public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _repo;
    private readonly IEmailService _email;
    private readonly IExamRepository _examRepo;

    public CandidateService(
        ICandidateRepository repo,
        IEmailService email,
        IExamRepository examRepo)
    {
        _repo = repo;
        _email = email;
        _examRepo = examRepo;
    }

public async Task<CandidateResponseDto?> GetById(int id)
{
    var candidate = await _repo.GetById(id);

    if (candidate == null)
        return null;

    return new CandidateResponseDto
    {
        Id = candidate.Id,
        Email = candidate.Email,
        FirstName = candidate.FirstName,
        LastName = candidate.LastName,
        PhoneNumber = candidate.PhoneNumber,
        Token = candidate.Token,
        StartedAt = candidate.StartedAt,
        SubmittedAt = candidate.SubmittedAt,
        FinalScore = candidate.FinalScore,
        ExamId = candidate.ExamId 
    };
}

public async Task<List<CandidateResponseDto>> GetAll()
{
    var candidates = await _repo.GetAll();

    return candidates.Select(c => new CandidateResponseDto
    {
        Id = c.Id,
        Email = c.Email,
        FirstName = c.FirstName,
        LastName = c.LastName,
        PhoneNumber = c.PhoneNumber,
        Token = c.Token,
        StartedAt = c.StartedAt,
        SubmittedAt = c.SubmittedAt,
        FinalScore = c.FinalScore,
        ExamId = c.ExamId 
    }).ToList();
}

public async Task<CreateCandidateResponseDto> CreateCandidate(CreateCandidateDto dto)
{
    var exists = await _repo.ExistsByEmail(dto.Email);

        if (exists)
    {
        return new CreateCandidateResponseDto
        {
            Id = 0,
            Email = dto.Email,
            Message = "Email already exists"
        };
    }
    var candidate = new Candidate
    {
        Email = dto.Email,
        //Token = Guid.NewGuid().ToString(),
        Token = null,
        ExamId = null
    };
    

    await _repo.Add(candidate);

    return new CreateCandidateResponseDto
    {
        Id = candidate.Id,
        Email = candidate.Email,
        Message = "Candidate created"
    };
}

public async Task<DeleteCandidateResponseDto?> Delete(int id)
{
    var candidate = await _repo.GetById(id);

    if (candidate == null)
        return null;

    await _repo.Delete(id);

    return new DeleteCandidateResponseDto
    {
        Id = id,
        Success = true,
        Message = "Candidate deleted"
    };
}

public async Task<string>  SendExamEmail(SendExamEmailDto dto)
{
    var exam = await _examRepo.GetExamByIdAsync(dto.ExamId);

    if (exam == null)
        return "Exam not found";

    var candidate = await _repo.GetById(dto.CandidateId);

    if (candidate == null)
        return "Candidate not found";

    // 1. Assign exam
    candidate.ExamId = dto.ExamId;

    // 2. GUARANTEE token exists
    if (string.IsNullOrEmpty(candidate.Token))
    {
        candidate.Token = Guid.NewGuid().ToString();
    }

    // 3. SAVE FIRST (VERY IMPORTANT)
    await _repo.Update(candidate);

    // 4. Build URL AFTER saving
    var examUrl = $"https://your-frontend.com/exam/{candidate.Token}";

    // 5. Send email
    await _email.SendEmail(
        candidate.Email,
        "Your Exam Link",
        $"Click here:\n{examUrl}"
    );
    
    return "Email sent successfully";

}


public async Task<string>  SendBulkExamEmail(SendBulkExamEmailDto dto)
{
    var exam = await _examRepo.GetExamByIdAsync(dto.ExamId);

    if (exam == null)
        return "Exam not found";

    var notFoundIds = new List<int>();

    foreach (var id in dto.CandidateIds)
    {
        var candidate = await _repo.GetById(id);

        if (candidate == null)
        {
            notFoundIds.Add(id);
            continue;
        }

        candidate.ExamId = dto.ExamId;

        if (string.IsNullOrEmpty(candidate.Token))
        {
            candidate.Token = Guid.NewGuid().ToString();
        }

        // SAVE BEFORE EMAIL
        await _repo.Update(candidate);

        var examUrl = $"https://your-frontend.com/exam/{candidate.Token}";

        await _email.SendEmail(
            candidate.Email,
            "Your Exam Link",
            $"Click here:\n{examUrl}"
        );

    }
    
    if (notFoundIds.Count > 0)
    {
        return $"Bulk completed. Not found IDs: {string.Join(", ", notFoundIds)}";
    }

    return "Bulk emails processed successfully";
    
}



public async Task<ExamPageDto?> GetExamPage(string token)
{
    var candidate = await _repo.GetByToken(token);

    if (candidate == null)
        return null;
if (candidate.ExamId is null)
    return null;

var exam = await _examRepo.GetExamByIdAsync(candidate.ExamId.Value);

    if (exam == null)
        return null;

    var now = DateTime.UtcNow;

    if (exam.WindowStartTime == null || exam.WindowStartTime > now)
        return null;

    if (exam.WindowEndTime == null || exam.WindowEndTime < now)
        return null;

    return new ExamPageDto
    {
        FirstName = candidate.FirstName,
        LastName = candidate.LastName,
        Email = candidate.Email,
        PhoneNumber = candidate.PhoneNumber,
        ExamId = candidate.ExamId
    };
}


public async Task<CompleteCandidateProfileResponseDto?> CompleteProfile(string token, CompleteCandidateProfileDto dto)
{
    var candidate = await _repo.GetByToken(token);

    Console.WriteLine(candidate == null 
        ? "CANDIDATE NOT FOUND" 
        : $"FOUND CANDIDATE ID = {candidate.Id}, TOKEN = {candidate.Token}");


    if (candidate == null)
        return null;

if (candidate.StartedAt != null)
{
    return new CompleteCandidateProfileResponseDto
    {
        Success = false,
        Message = "Profile cannot be edited after exam started"
    };
}
    candidate.FirstName = dto.FirstName;
    candidate.LastName = dto.LastName;
    candidate.PhoneNumber = dto.PhoneNumber;

    await _repo.Update(candidate);

    return new CompleteCandidateProfileResponseDto
    {
        Success = true,
        Message = "Profile completed"
    };
}


public async Task<object> StartExam(string token)
{
    var candidate = await _repo.GetByToken(token);

    if (candidate == null || candidate.Exam == null)
        return "Invalid token";

    var now = DateTime.UtcNow;
    var exam = candidate.Exam;

    if (candidate.StartedAt == null)
    {
        candidate.StartedAt = now;
        await _repo.Update(candidate);
    }

    var startTime = candidate.StartedAt.Value;

    if (exam.DurationMinutes == null || exam.DurationMinutes <= 0)
        return "Invalid exam duration";

    var endTime = startTime.AddMinutes(exam.DurationMinutes.Value);

    if (now > endTime)
        return "Your exam time has finished";

    return new StartExamResponseDto
    {
        StartedAt = startTime,
        ExamId = exam.Id,
        PositionTitle = exam.PositionTitle,
        DurationMinutes = exam.DurationMinutes,

        Questions = exam.ExamQuestions.Select(q => new ExamQuestionDto
        {
            Id = q.Question.Id,
            QuestionText = q.Question.QuestionText,
            QuestionImage = q.Question.QuestionImage,

            Choices = q.Question.Choices.Select(c => new ExamChoiceDto
            {
                Id = c.Id,
                Text = c.ChoiceText
            }).ToList()
        }).ToList()
    };
}


}
}