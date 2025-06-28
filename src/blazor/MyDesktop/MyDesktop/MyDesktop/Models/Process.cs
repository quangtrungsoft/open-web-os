public class Process
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ProcessState State { get; set; }
    public int Priority { get; set; }
    public List<int> PageTable { get; set; } = new();
}

public enum ProcessState
{
    Ready,
    Running,
    Waiting,
    Terminated
} 