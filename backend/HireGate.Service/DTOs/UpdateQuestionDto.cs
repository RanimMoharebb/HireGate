using System.ComponentModel.DataAnnotations;

namespace HireGate.Service.DTOs
{
    public class UpdateQuestionDto
    {
        public int? TopicId { get; set; }

        [Required]
        [MaxLength(200)]
        public string QuestionText { get; set; } = null!;

        [MaxLength(200)]
        public string? QuestionImage { get; set; }

        [Required]
        [MinLength(2, ErrorMessage = "Question must have at least 2 choices")]
        public ICollection<UpdateChoiceDto> Choices { get; set; } = new List<UpdateChoiceDto>();
    }
}