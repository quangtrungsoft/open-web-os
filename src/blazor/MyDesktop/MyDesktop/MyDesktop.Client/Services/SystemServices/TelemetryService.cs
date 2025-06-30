using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyDesktop.Client.Services.SystemServices
{
    public class TelemetryService : ITelemetryService
    {
        public async Task TrackEventAsync(string eventName, Dictionary<string, object> properties)
        {
            var telemetryData = new TelemetryData
            {
                EventName = eventName,
                Properties = properties,
                Timestamp = DateTime.UtcNow,
                SessionId = GetCurrentSessionId()
            };

            // TODO: Send to backend
            await Task.CompletedTask;
        }

        public async Task TrackPerformanceAsync(string metricName, double value)
        {
            await TrackEventAsync("Performance", new Dictionary<string, object>
            {
                ["metric"] = metricName,
                ["value"] = value
            });
        }

        private string GetCurrentSessionId()
        {
            return Guid.NewGuid().ToString();
        }
    }

    public class TelemetryData
    {
        public string EventName { get; set; }
        public Dictionary<string, object> Properties { get; set; }
        public DateTime Timestamp { get; set; }
        public string SessionId { get; set; }
    }
}