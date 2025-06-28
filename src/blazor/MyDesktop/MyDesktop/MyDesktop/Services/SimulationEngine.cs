using System;
using System.Threading;
using System.Collections.Generic;
using System.Linq;

public class SimulationEngine : ISimulationEngine
{
    public CpuScheduler Scheduler { get; }
    public MemoryManager MemoryManager { get; }
    public FileSystemManager FileSystemManager { get; }
    public DeviceDriverManager DeviceDriverManager { get; }
    public NetworkStack NetworkStack { get; }

    public event EventHandler OnTick;
    private Timer _timer;

    public SimulationEngine()
    {
        Scheduler = new CpuScheduler();
        MemoryManager = new MemoryManager();
        FileSystemManager = new FileSystemManager();
        DeviceDriverManager = new DeviceDriverManager();
        NetworkStack = new NetworkStack();
    }

    public void Start()
    {
        _timer = new Timer(Tick, null, 0, 200);
    }
    public void Stop() => _timer?.Dispose();

    private void Tick(object state)
    {
        // Gọi tick cho từng manager nếu cần
        OnTick?.Invoke(this, EventArgs.Empty);
    }

    public void SaveState() { /* TODO: Serialize state */ }
    public void LoadState() { /* TODO: Deserialize state */ }
}

public class CpuScheduler
{
    private readonly List<Process> _processes = new();
    private int _currentIndex = -1;
    public event EventHandler? OnProcessStateChanged;
    private int _nextPid = 1;

    public IReadOnlyList<Process> Processes => _processes.AsReadOnly();

    public Process? RunningProcess => _processes.FirstOrDefault(p => p.State == ProcessState.Running);

    public void Enqueue(string name, int priority = 1)
    {
        var process = new Process
        {
            Id = _nextPid++,
            Name = name,
            State = ProcessState.Ready,
            Priority = priority
        };
        _processes.Add(process);
        OnProcessStateChanged?.Invoke(this, EventArgs.Empty);
    }

    public void Kill(int pid)
    {
        var proc = _processes.FirstOrDefault(p => p.Id == pid);
        if (proc != null)
        {
            proc.State = ProcessState.Terminated;
            OnProcessStateChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    public void Dequeue()
    {
        if (_processes.Count == 0) return;
        var proc = _processes.FirstOrDefault(p => p.State == ProcessState.Ready);
        if (proc != null)
        {
            proc.State = ProcessState.Terminated;
            OnProcessStateChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    public void Tick()
    {
        if (_processes.Count == 0) return;
        // Dọn các tiến trình đã terminate
        _processes.RemoveAll(p => p.State == ProcessState.Terminated);
        if (_processes.Count == 0) return;
        // Chuyển process đang chạy về Ready
        var running = _processes.FirstOrDefault(p => p.State == ProcessState.Running);
        if (running != null) running.State = ProcessState.Ready;
        // Round-robin: chọn tiến trình tiếp theo
        _currentIndex = (_currentIndex + 1) % _processes.Count;
        _processes[_currentIndex].State = ProcessState.Running;
        OnProcessStateChanged?.Invoke(this, EventArgs.Empty);
    }

    public string ExecuteCommand(string command)
    {
        var parts = command.Trim().Split(' ', 2);
        var cmd = parts[0].ToLower();
        switch (cmd)
        {
            case "run":
                if (parts.Length > 1)
                {
                    Enqueue(parts[1]);
                    return $"Process '{parts[1]}' started.";
                }
                return "Usage: run <name>";
            case "ps":
                return string.Join("\n", _processes.Select(p => $"{p.Id}\t{p.Name}\t{p.State}"));
            case "kill":
                if (parts.Length > 1 && int.TryParse(parts[1], out int pid))
                {
                    Kill(pid);
                    return $"Process {pid} killed.";
                }
                return "Usage: kill <pid>";
            default:
                return $"Unknown command: {cmd}";
        }
    }
}

public class MemoryManager
{
    public event EventHandler? OnMemoryUpdate;
    private readonly List<PageFrame> _frames = new();
    private readonly Dictionary<int, List<int>> _pageTables = new(); // processId -> list of frameIds
    private const int TotalFrames = 16;

    public IReadOnlyList<PageFrame> Frames => _frames.AsReadOnly();
    public IReadOnlyDictionary<int, List<int>> PageTables => _pageTables;

    public MemoryManager()
    {
        for (int i = 0; i < TotalFrames; i++)
        {
            _frames.Add(new PageFrame { FrameId = i, IsAllocated = false });
        }
    }

    public bool Allocate(int processId, int numPages)
    {
        var freeFrames = _frames.Where(f => !f.IsAllocated).Take(numPages).ToList();
        if (freeFrames.Count < numPages) return false;
        if (!_pageTables.ContainsKey(processId)) _pageTables[processId] = new List<int>();
        foreach (var frame in freeFrames)
        {
            frame.IsAllocated = true;
            frame.ProcessId = processId;
            frame.PageNumber = _pageTables[processId].Count;
            _pageTables[processId].Add(frame.FrameId);
        }
        OnMemoryUpdate?.Invoke(this, EventArgs.Empty);
        return true;
    }

    public void Free(int processId)
    {
        if (!_pageTables.ContainsKey(processId)) return;
        foreach (var frameId in _pageTables[processId])
        {
            var frame = _frames[frameId];
            frame.IsAllocated = false;
            frame.ProcessId = null;
            frame.PageNumber = null;
        }
        _pageTables.Remove(processId);
        OnMemoryUpdate?.Invoke(this, EventArgs.Empty);
    }

    public void Tick(IEnumerable<Process> processes)
    {
        // Mô phỏng page fault: random process sẽ yêu cầu thêm page
        var active = processes.Where(p => p.State == ProcessState.Running).ToList();
        if (active.Count == 0) return;
        var rand = new Random();
        var proc = active[rand.Next(active.Count)];
        // 50% xác suất yêu cầu thêm page
        if (rand.NextDouble() < 0.5)
        {
            Allocate(proc.Id, 1);
        }
        OnMemoryUpdate?.Invoke(this, EventArgs.Empty);
    }

    public List<int> GetPageTable(int processId)
    {
        return _pageTables.ContainsKey(processId) ? _pageTables[processId] : new List<int>();
    }
}

public class FileSystemManager
{
    public event EventHandler? OnFileSystemChanged;
    private readonly Dictionary<string, FileEntry> _entries = new();

    public FileSystemManager()
    {
        // Khởi tạo root directory
        var root = new FileEntry
        {
            Path = "/",
            IsDirectory = true,
            CreatedAt = DateTime.Now,
            ModifiedAt = DateTime.Now
        };
        _entries["/"] = root;
    }

    public bool Create(string path, bool isDirectory)
    {
        if (_entries.ContainsKey(path)) return false;
        var parentPath = System.IO.Path.GetDirectoryName(path)?.Replace("\\", "/") ?? "/";
        if (!string.IsNullOrEmpty(parentPath) && !_entries.ContainsKey(parentPath)) return false;
        var entry = new FileEntry
        {
            Path = path,
            IsDirectory = isDirectory,
            CreatedAt = DateTime.Now,
            ModifiedAt = DateTime.Now
        };
        _entries[path] = entry;
        if (!string.IsNullOrEmpty(parentPath) && _entries.ContainsKey(parentPath))
        {
            _entries[parentPath].Children.Add(entry);
        }
        OnFileSystemChanged?.Invoke(this, EventArgs.Empty);
        return true;
    }

    public bool Write(string path, string content)
    {
        if (!_entries.ContainsKey(path) || _entries[path].IsDirectory) return false;
        _entries[path].Content = content;
        _entries[path].ModifiedAt = DateTime.Now;
        OnFileSystemChanged?.Invoke(this, EventArgs.Empty);
        return true;
    }

    public string? Read(string path)
    {
        if (!_entries.ContainsKey(path) || _entries[path].IsDirectory) return null;
        return _entries[path].Content;
    }

    public List<FileEntry> List(string path)
    {
        if (!_entries.ContainsKey(path) || !_entries[path].IsDirectory) return new List<FileEntry>();
        return _entries[path].Children;
    }

    public bool Delete(string path)
    {
        if (!_entries.ContainsKey(path) || path == "/") return false;
        var entry = _entries[path];
        var parentPath = System.IO.Path.GetDirectoryName(path)?.Replace("\\", "/") ?? "/";
        if (!string.IsNullOrEmpty(parentPath) && _entries.ContainsKey(parentPath))
        {
            _entries[parentPath].Children.Remove(entry);
        }
        _entries.Remove(path);
        OnFileSystemChanged?.Invoke(this, EventArgs.Empty);
        return true;
    }

    public FileEntry? GetEntry(string path)
    {
        return _entries.ContainsKey(path) ? _entries[path] : null;
    }
}

public class DeviceDriverManager
{
    public ConsoleDriver Console { get; }
    public TimerDriver Timer { get; }
    public NetworkDriver Network { get; }

    public DeviceDriverManager()
    {
        Console = new ConsoleDriver();
        Timer = new TimerDriver();
        Network = new NetworkDriver();
    }

    public class ConsoleDriver
    {
        public event EventHandler<string>? OnConsoleOutput;
        public void Write(string text)
        {
            OnConsoleOutput?.Invoke(this, text);
        }
    }

    public class TimerDriver
    {
        public event EventHandler? OnTimer;
        public void Tick()
        {
            OnTimer?.Invoke(this, EventArgs.Empty);
        }
    }

    public class NetworkDriver
    {
        public event EventHandler<Packet>? OnNetworkPacket;
        public void Send(Packet packet)
        {
            OnNetworkPacket?.Invoke(this, packet);
        }
    }
}

public class NetworkStack
{
    private readonly List<Packet> _sentPackets = new();
    private readonly List<Packet> _receivedPackets = new();
    public event EventHandler<Packet>? OnPacketSent;
    public event EventHandler<Packet>? OnPacketReceived;

    public IReadOnlyList<Packet> SentPackets => _sentPackets.AsReadOnly();
    public IReadOnlyList<Packet> ReceivedPackets => _receivedPackets.AsReadOnly();

    public void Send(string destination, string data)
    {
        var packet = new Packet
        {
            Source = "localhost",
            Destination = destination,
            Data = data,
            Timestamp = DateTime.Now
        };
        _sentPackets.Add(packet);
        OnPacketSent?.Invoke(this, packet);
        // Mô phỏng gửi qua JSInterop nếu cần
    }

    public void Receive(Packet packet)
    {
        _receivedPackets.Add(packet);
        OnPacketReceived?.Invoke(this, packet);
    }

    public void Tick()
    {
        // Mô phỏng nhận packet ngẫu nhiên nếu cần
    }
} 