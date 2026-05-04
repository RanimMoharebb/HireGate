using FluentValidation;
using HireGate.Service.DTOs;

public class SendExamEmailValidator : AbstractValidator<SendExamEmailDto>
{
    public SendExamEmailValidator()
    {
        RuleFor(x => x.ExamId)
            .GreaterThan(0);
        
        RuleFor(x => x.CandidateId)
            .GreaterThan(0);
    }
}