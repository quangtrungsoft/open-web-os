using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Components;

public class WindowManagerService : IWindowManager
{
    public event Action? OnWindowsChanged;
    private readonly List<WindowInfo> _windows = new();
    private int _nextZ = 1;

    public IReadOnlyList<WindowInfo> Windows => _windows.AsReadOnly();

    public WindowInfo OpenWindow(string title, Type componentType, Dictionary<string, object>? parameters = null)
    {
        var win = new WindowInfo
        {
            Id = Guid.NewGuid(),
            Title = title,
            ComponentType = componentType,
            Parameters = parameters,
            Position = (100 + 30 * _windows.Count, 100 + 30 * _windows.Count),
            Size = (500, 350),
            ZIndex = _nextZ++,
            IsActive = true
        };
        foreach (var w in _windows) w.IsActive = false;
        _windows.Add(win);
        OnWindowsChanged?.Invoke();
        return win;
    }

    public void CloseWindow(Guid id)
    {
        _windows.RemoveAll(w => w.Id == id);
        if (_windows.Count > 0) _windows[^1].IsActive = true;
        OnWindowsChanged?.Invoke();
    }

    public void FocusWindow(Guid id)
    {
        var win = _windows.Find(w => w.Id == id);
        if (win == null) return;
        foreach (var w in _windows) w.IsActive = false;
        win.IsActive = true;
        win.ZIndex = _nextZ++;
        OnWindowsChanged?.Invoke();
    }

    public void MoveWindow(Guid id, (int x, int y) pos)
    {
        var win = _windows.Find(w => w.Id == id);
        if (win == null) return;
        win.Position = pos;
        OnWindowsChanged?.Invoke();
    }

    public void ResizeWindow(Guid id, (int w, int h) size)
    {
        var win = _windows.Find(w => w.Id == id);
        if (win == null) return;
        win.Size = size;
        OnWindowsChanged?.Invoke();
    }
}

public class WindowInfo
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public Type ComponentType { get; set; }
    public Dictionary<string, object>? Parameters { get; set; }
    public (int x, int y) Position { get; set; }
    public (int w, int h) Size { get; set; }
    public int ZIndex { get; set; }
    public bool IsActive { get; set; }
} 