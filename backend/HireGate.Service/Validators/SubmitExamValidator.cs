using FluentValidation;
using HireGate.Service.DTOs;

namespace HireGate.Validators;

public class SubmitExamValidator : AbstractValidator<SubmitExamDto>
{
    public SubmitExamValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty();

        RuleFor(x => x.Answers)
            .NotEmpty().WithMessage("Answers are required");

        RuleForEach(x => x.Answers).ChildRules(answer =>
        {
            answer.RuleFor(a => a.QuestionId).GreaterThan(0);
            answer.RuleFor(a => a.ChoiceId).GreaterThan(0);
        });
    }
}