using System;
using MyDesktop.Models;

namespace MyDesktop.Services
{
    public class OrchestratorService
    {
        public event Action<string>? OnThemeChanged;
        private readonly RuleEngineService _ruleEngine;
        private ThemeManifest? _currentTheme;

        public OrchestratorService(RuleEngineService ruleEngine)
        {
            _ruleEngine = ruleEngine;
        }

        public ValidationResult InstallTheme(ThemeManifest manifest)
        {
            var result = _ruleEngine.ValidateTheme(manifest);
            if (!result.IsValid)
                return result;
            _currentTheme = manifest;
            OnThemeChanged?.Invoke(manifest.ThemeId);
            return result;
        }

        public ThemeManifest? GetCurrentTheme() => _currentTheme;
    }
} 