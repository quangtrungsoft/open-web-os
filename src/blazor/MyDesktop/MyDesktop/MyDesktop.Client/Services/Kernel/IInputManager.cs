namespace MyDesktop.Client.Services.Kernel
{
    public interface IInputManager
    {
        Task<bool> HandleMouseEventAsync(MouseEvent mouseEvent);
        Task<bool> HandleKeyboardEventAsync(KeyboardEvent keyboardEvent);
        Task<bool> HandleTouchEventAsync(TouchEvent touchEvent);
    }

    public class MouseEvent
    {
        public int X { get; set; }
        public int Y { get; set; }
        public MouseButton Button { get; set; }
        public MouseEventType Type { get; set; }
    }

    public enum MouseButton
    {
        Left,
        Right,
        Middle
    }

    public enum MouseEventType
    {
        Move,
        Click,
        DoubleClick,
        Drag
    }

    public class KeyboardEvent
    {
        public string Key { get; set; }
        public bool Ctrl { get; set; }
        public bool Alt { get; set; }
        public bool Shift { get; set; }
        public KeyboardEventType Type { get; set; }
    }

    public enum KeyboardEventType
    {
        KeyDown,
        KeyUp,
        KeyPress
    }

    public class TouchEvent
    {
        public int X { get; set; }
        public int Y { get; set; }
        public TouchEventType Type { get; set; }
    }

    public enum TouchEventType
    {
        TouchStart,
        TouchMove,
        TouchEnd
    }
}