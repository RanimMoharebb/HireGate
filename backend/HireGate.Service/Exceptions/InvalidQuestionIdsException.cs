namespace HireGate.Service.Exceptions;

public class InvalidQuestionIdsException : Exception
{
    public InvalidQuestionIdsException(IEnumerable<int> ids)
        : base($"Question IDs not found: {string.Join(", ", ids)}") { }
}
