namespace HireGate.Service.DTOs;

public class BulkEmailResultDto
{
    public int Total { get; set; }
    public List<int> NotFoundIds { get; set; } = new();
    public List<BulkEmailItemResultDto> Results { get; set; } = new();
}