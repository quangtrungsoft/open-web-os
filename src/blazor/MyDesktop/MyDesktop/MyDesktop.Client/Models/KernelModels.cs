namespace MyDesktop.Client.Models
{
    public class VirtualProcess
    {
        public string Id { get; set; }
        public string AppId { get; set; }
        public ProcessState State { get; set; }
    }

    public enum ProcessState
    {
        Running,
        Suspended,
        Terminated
    }

    public class ProcessOptions
    {
        public int Priority { get; set; }
    }

    public class MemoryInfo
    {
        public string Id { get; set; }
        public int Size { get; set; }
    }

    public class VirtualFile
    {
        public string Path { get; set; }
        public FileType Type { get; set; }
    }

    public enum FileType
    {
        File,
        Directory
    }
}