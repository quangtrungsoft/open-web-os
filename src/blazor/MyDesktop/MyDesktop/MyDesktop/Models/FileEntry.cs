public class FileEntry
{
    public string Path { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
    public bool IsDirectory { get; set; }
    public List<FileEntry> Children { get; set; } = new();
} 