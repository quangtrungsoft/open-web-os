using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyDesktop.Client.Services.SystemServices
{
    public class EventBusService : IEventBusService
    {
        private readonly Dictionary<string, List<Func<object, Task>>> _subscribers = new();

        public async Task PublishAsync<T>(T eventData) where T : class
        {
            var eventType = typeof(T).Name;
            if (_subscribers.ContainsKey(eventType))
            {
                foreach (var subscriber in _subscribers[eventType])
                {
                    await subscriber(eventData);
                }
            }
        }

        public void Subscribe<T>(Func<T, Task> handler) where T : class
        {
            var eventType = typeof(T).Name;
            if (!_subscribers.ContainsKey(eventType))
                _subscribers[eventType] = new List<Func<object, Task>>();

            _subscribers[eventType].Add(async (data) => await handler((T)data));
        }

        public void Unsubscribe<T>(Func<T, Task> handler) where T : class
        {
            var eventType = typeof(T).Name;
            if (_subscribers.ContainsKey(eventType))
            {
                // Note: This is a simplified implementation
                // In a real scenario, you'd want to store the actual handler reference
            }
        }
    }

    public interface IEventBusService
    {
        Task PublishAsync<T>(T eventData) where T : class;
        void Subscribe<T>(Func<T, Task> handler) where T : class;
        void Unsubscribe<T>(Func<T, Task> handler) where T : class;
    }
}