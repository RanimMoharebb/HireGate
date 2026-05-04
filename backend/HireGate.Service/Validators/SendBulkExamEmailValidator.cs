using FluentValidation;
using HireGate.Service.DTOs;

public class SendBulkExamEmailDtoValidator : AbstractValidator<SendBulkExamEmailDto>
{
    public SendBulkExamEmailDtoValidator()
    {
        RuleFor(x => x.ExamId)
            .GreaterThan(0)
            .WithMessage("ExamId must be greater than 0");

        RuleFor(x => x.CandidateIds)
            .NotNull()
            .NotEmpty()
            .WithMessage("Candidate list cannot be empty");
        
        RuleFor(x => x.CandidateIds)
            .NotNull()
            .NotEmpty()
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("Duplicate candidate IDs are not allowed")
            .Must(ids => ids.Count <= 100)
            .WithMessage("Maximum 100 candidates allowed per request");
    }
}