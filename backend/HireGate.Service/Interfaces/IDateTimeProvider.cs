using System;

namespace HireGate.Service.Interfaces
{
    public interface IDateTimeProvider
    {
        DateTime Now { get; }
    }
}
