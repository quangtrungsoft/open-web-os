using MouseEventModel = MyDesktop.Client.Models.MouseEvent;
using KeyboardEventModel = MyDesktop.Client.Models.KeyboardEvent;
using TouchEventModel = MyDesktop.Client.Models.TouchEvent;
using MyDesktop.Client.Models;
using MyDesktop.Client.Services.SystemServices;

namespace MyDesktop.Client.Services.Kernel
{
    public class InputManager : IInputManager
    {
        private readonly IEventBusService _eventBus;

        public InputManager(IEventBusService eventBus)
        {
            _eventBus = eventBus;
        }

        public async Task<bool> HandleMouseEventAsync(MouseEvent mouseEvent)
        {
            var modelEvent = new MouseEventModel
            {
                X = mouseEvent.X,
                Y = mouseEvent.Y,
                Button = mouseEvent.Button.ToString(),
                Type = mouseEvent.Type.ToString()
            };
            await _eventBus.PublishAsync(new MouseEventOccurredEvent { MouseEvent = modelEvent });
            return await Task.FromResult(true);
        }

        public async Task<bool> HandleKeyboardEventAsync(KeyboardEvent keyboardEvent)
        {
            var modelEvent = new KeyboardEventModel
            {
                Key = keyboardEvent.Key,
                CtrlKey = keyboardEvent.Ctrl,
                AltKey = keyboardEvent.Alt,
                ShiftKey = keyboardEvent.Shift,
                Type = keyboardEvent.Type.ToString()
            };
            await _eventBus.PublishAsync(new KeyboardEventOccurredEvent { KeyboardEvent = modelEvent });
            return await Task.FromResult(true);
        }

        public async Task<bool> HandleTouchEventAsync(TouchEvent touchEvent)
        {
            var modelEvent = new TouchEventModel
            {
                X = touchEvent.X,
                Y = touchEvent.Y,
                Type = touchEvent.Type.ToString(),
                TouchCount = 1 // Default to 1 for now
            };
            await _eventBus.PublishAsync(new TouchEventOccurredEvent { TouchEvent = modelEvent });
            return await Task.FromResult(true);
        }
    }
}