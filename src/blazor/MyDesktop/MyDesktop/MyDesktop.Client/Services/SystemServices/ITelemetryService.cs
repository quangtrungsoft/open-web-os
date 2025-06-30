using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyDesktop.Client.Services.SystemServices
{
    public interface ITelemetryService
    {
        Task TrackEventAsync(string eventName, Dictionary<string, object> properties);
        Task TrackPerformanceAsync(string metricName, double value);
    }
}