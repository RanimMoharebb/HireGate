using HireGate.Data.Models;
using HireGate.Service.DTOs;

namespace HireGate.Service.Mappers
{
    public static class ExamMapper
    {
        // Mapping Exam entity to ExamDto
        public static ExamDto ToDto(Exam e)
        {
            return new ExamDto
            {
                Id = e.Id,
                PositionTitle = e.PositionTitle!,
                DurationMinutes = e.DurationMinutes,
                WindowStartTime = e.WindowStartTime,
                WindowEndTime = e.WindowEndTime,

                Questions = e.ExamQuestions?
                    .Where(eq => eq.Question != null)
                    .Select(eq => ToQuestionDto(eq.Question))
                    .ToList() ?? new List<QuestionDto>()
            };
        }

        // Helper method to map Question entity to QuestionDto
        public static QuestionDto ToQuestionDto(Question q)
        {
            return new QuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText!,
                QuestionImage = q.QuestionImage,

                Choices = q.Choices?
                    .Select(c => new ChoiceDto
                    {
                        Id = c.Id,
                        ChoiceText = c.ChoiceText!
                    })
                    .ToList() ?? new List<ChoiceDto>()
            };
        }


        // transforming DTO back to Entity (for Create/Update operations)
        // takes the input and transfer it into db model
        public static Exam ToEntity(CreateExamDto dto)
{
        return new Exam
        {
            PositionTitle = dto.PositionTitle,
            DurationMinutes = dto.DurationMinutes,
            WindowStartTime = dto.WindowStartTime,
            WindowEndTime = dto.WindowEndTime,

            // IMPORTANT: do NOT map questions here
            ExamQuestions = new List<ExamQuestion>()
        };
}
    }
}
