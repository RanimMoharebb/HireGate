using System;
using HireGate.Service.Interfaces;

namespace HireGate.Service.Implementations
{
    public class EgyptDateTimeProvider : IDateTimeProvider
    {
        private readonly TimeZoneInfo _egyptTimeZone;

        public EgyptDateTimeProvider()
        {
            try
            {
                _egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                _egyptTimeZone = TimeZoneInfo.Utc;
            }
            catch (InvalidTimeZoneException)
            {
                _egyptTimeZone = TimeZoneInfo.Utc;
            }
        }

        public DateTime Now => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _egyptTimeZone);
    }
}
