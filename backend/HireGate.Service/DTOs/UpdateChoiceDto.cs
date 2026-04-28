namespace HireGate.Service.DTOs
{
    public class UpdateChoiceDto
    {
        public string ChoiceText { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
