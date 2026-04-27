using FluentValidation;
using backend.HireGate.Service.DTOs;

namespace backend.HireGate.Service.Validators
{
    public class QuestionDtoValidator : AbstractValidator<QuestionDto>
    {
        public QuestionDtoValidator()
        {
            RuleFor(x => x.QuestionText)
                .NotEmpty()
                .Length(5, 500);
        }
    }
}