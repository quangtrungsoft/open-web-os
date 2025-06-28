using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Components;

public interface IWindowManager
{
    event Action OnWindowsChanged;
    IReadOnlyList<WindowInfo> Windows { get; }
    WindowInfo OpenWindow(string title, Type componentType, Dictionary<string, object>? parameters = null);
    void CloseWindow(Guid id);
    void FocusWindow(Guid id);
    void MoveWindow(Guid id, (int x, int y) pos);
    void ResizeWindow(Guid id, (int w, int h) size);
} 