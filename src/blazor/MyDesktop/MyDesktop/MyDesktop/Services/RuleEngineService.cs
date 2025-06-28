using System.Collections.Generic;
using System.Linq;
using MyDesktop.Models;

namespace MyDesktop.Services
{
    public class RuleEngineService
    {
        public ValidationResult ValidateTheme(ThemeManifest manifest)
        {
            var errors = new List<string>();
            // Rule: At least 10 color variables
            var colorRule = manifest.Rules.FirstOrDefault(r => r.Name == "color-count");
            if (colorRule != null && manifest.Colors.Count < (colorRule.Min ?? 10))
                errors.Add($"Theme must define at least {colorRule.Min ?? 10} color variables.");
            // Rule: Desktop gradient
            if (!manifest.Gradients.ContainsKey("desktop"))
                errors.Add("Theme must define a desktop gradient.");
            // Rule: Window shadow
            if (!manifest.Components.ContainsKey("window") || !manifest.Components["window"].ContainsKey("shadow"))
                errors.Add("Window component must define shadow.");
            // Rule: Taskbar background
            if (!manifest.Components.ContainsKey("taskbar") || !manifest.Components["taskbar"].ContainsKey("background"))
                errors.Add("Taskbar must define background.");
            // Rule: Scrollbar style
            if (!manifest.Components.ContainsKey("scrollbar"))
                errors.Add("Scrollbar style must be defined.");
            // ... add more rules as needed
            return errors.Any() ? ValidationResult.Failure(errors) : ValidationResult.Success;
        }
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
        public static ValidationResult Success => new ValidationResult { IsValid = true };
        public static ValidationResult Failure(List<string> errors) => new ValidationResult { IsValid = false, Errors = errors };
    }
} 