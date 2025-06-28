using System.Collections.Generic;

namespace MyDesktop.Models
{
    public class ThemeManifest
    {
        public string ThemeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool DarkMode { get; set; }
        public Dictionary<string, string> Colors { get; set; } = new();
        public Dictionary<string, string> Gradients { get; set; } = new();
        public TypographyConfig Typography { get; set; } = new();
        public Dictionary<string, Dictionary<string, string>> Components { get; set; } = new();
        public List<ThemeRule> Rules { get; set; } = new();
    }

    public class TypographyConfig
    {
        public string FontFamily { get; set; } = "";
        public string FontSize { get; set; } = "";
    }

    public class ThemeRule
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? Min { get; set; }
        public int? Max { get; set; }
    }
} 