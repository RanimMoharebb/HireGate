namespace HireGate.Service.DTOs
{
    public class CreateQuestionDto
    {
        public int? TopicId { get; set; }
        public string QuestionText { get; set; } = null!;
        public string? QuestionImage { get; set; }
        public ICollection<CreateChoiceDto> Choices { get; set; } = new List<CreateChoiceDto>();
    }
}