using System;

public interface ISimulationEngine
{
    event EventHandler OnTick;
    CpuScheduler Scheduler { get; }
    MemoryManager MemoryManager { get; }
    FileSystemManager FileSystemManager { get; }
    DeviceDriverManager DeviceDriverManager { get; }
    NetworkStack NetworkStack { get; }
    void Start();
    void Stop();
    void SaveState();
    void LoadState();
} 