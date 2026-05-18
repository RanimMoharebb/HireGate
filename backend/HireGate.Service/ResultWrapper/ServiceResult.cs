namespace HireGate.ResultWrapper
{
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Error { get; set; }

        public static ServiceResult<T> Ok(T data)
        {
            return new ServiceResult<T>
            {
                Success = true,
                Data = data,
                Error = null
            };
        }

        public static ServiceResult<T> Fail(string error)
        {
            return new ServiceResult<T>
            {
                Success = false,
                Data = default,
                Error = error
            };
        }
    }
}