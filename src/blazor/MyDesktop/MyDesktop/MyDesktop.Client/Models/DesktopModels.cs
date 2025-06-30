namespace MyDesktop.Client.Models
{
    public class DesktopIconInfo
    {
        public string AppId { get; set; }
        public string Name { get; set; }
        public string IconPath { get; set; }
    }

    public class DockAppInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string IconPath { get; set; }
        public bool IsRunning { get; set; }
    }

    public class VirtualSpace
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}