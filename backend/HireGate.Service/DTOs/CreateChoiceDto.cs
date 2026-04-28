namespace HireGate.Service.DTOs
{
    public class CreateChoiceDto
    {
        public int QuestionId { get; set; }
        public string ChoiceText { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}