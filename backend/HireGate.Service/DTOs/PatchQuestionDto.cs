namespace HireGate.Service.DTOs
{
    public class PatchQuestionDto
    {
        public int? TopicId { get; set; }
        public string? QuestionText { get; set; }
        public string? QuestionImage { get; set; }
        public ICollection<PatchChoiceDto>? Choices { get; set; }
    }
}
