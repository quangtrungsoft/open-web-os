using Microsoft.AspNetCore.SignalR;

namespace MyDesktop.Services.SystemServices
{
    public class EventBusHub : Hub
    {
        public async Task PublishEvent(string eventType, object eventData)
        {
            await Clients.All.SendAsync("EventPublished", eventType, eventData);
        }

        public async Task SubscribeToEvent(string eventType)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, eventType);
        }

        public async Task UnsubscribeFromEvent(string eventType)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventType);
        }
    }
}