namespace HireGate.Service.DTOs;

public class SubmitExamDto
{
    public string Token { get; set; } = null!;
    public List<QuestionAnswerDto> Answers { get; set; } = new();
}
