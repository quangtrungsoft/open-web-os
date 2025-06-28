using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using MyDesktop.Models;

namespace MyDesktop.Services
{
    public class RuleEngineService
    {
        public ValidationResult ValidateTheme(ThemeManifest theme)
        {
            var result = new ValidationResult();
            
            // Validate required fields
            if (string.IsNullOrEmpty(theme.ThemeId))
                result.Errors.Add("ThemeId is required");
            
            if (string.IsNullOrEmpty(theme.Name))
                result.Errors.Add("Name is required");
            
            // Validate design system (as warnings, not errors)
            ValidateDesignSystem(theme.DesignSystem, result);
            
            // Validate rules
            ValidateRules(theme.Rules, result);
            
            // Theme is valid if no critical errors (warnings don't prevent application)
            result.IsValid = result.Errors.Count == 0;
            return result;
        }
        
        private void ValidateDesignSystem(DesignSystem designSystem, ValidationResult result)
        {
            // Validate Colors
            ValidateColorPalette(designSystem.Colors, result);
            
            // Validate Typography
            ValidateTypography(designSystem.Typography, result);
            
            // Validate Spacing
            ValidateSpacing(designSystem.Spacing, result);
            
            // Validate Borders
            ValidateBorders(designSystem.Borders, result);
            
            // Validate Shadows
            ValidateShadows(designSystem.Shadows, result);
            
            // Validate Layout
            ValidateLayout(designSystem.Layout, result);
            
            // Validate Animations
            ValidateAnimations(designSystem.Animations, result);
            
            // Validate Components
            ValidateComponents(designSystem.Components, result);
        }
        
        private void ValidateColorPalette(ColorPalette colors, ValidationResult result)
        {
            var colorProperties = typeof(ColorPalette).GetProperties();
            
            foreach (var prop in colorProperties)
            {
                var value = prop.GetValue(colors) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidColor(value))
                    {
                        result.Warnings.Add($"Color format warning for {prop.Name}: {value} (may not render correctly)");
                    }
                }
            }
        }
        
        private void ValidateTypography(TypographyConfig typography, ValidationResult result)
        {
            // Validate font families
            var fontFamilyProps = new[] { "FontFamilyPrimary", "FontFamilySecondary", "FontFamilyMonospace", "FontFamilyDisplay" };
            foreach (var prop in fontFamilyProps)
            {
                var value = typeof(TypographyConfig).GetProperty(prop)?.GetValue(typography) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidFontFamily(value))
                {
                    result.Warnings.Add($"Font family format warning for {prop}: {value}");
                }
            }
            
            // Validate font sizes
            var fontSizeProps = typeof(TypographyConfig).GetProperties().Where(p => p.Name.StartsWith("FontSize"));
            foreach (var prop in fontSizeProps)
            {
                var value = prop.GetValue(typography) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidFontSize(value))
                {
                    result.Warnings.Add($"Font size format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate font weights
            var fontWeightProps = typeof(TypographyConfig).GetProperties().Where(p => p.Name.StartsWith("FontWeight"));
            foreach (var prop in fontWeightProps)
            {
                var value = prop.GetValue(typography) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidFontWeight(value))
                {
                    result.Warnings.Add($"Font weight format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate line heights
            var lineHeightProps = typeof(TypographyConfig).GetProperties().Where(p => p.Name.StartsWith("LineHeight"));
            foreach (var prop in lineHeightProps)
            {
                var value = prop.GetValue(typography) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidLineHeight(value))
                {
                    result.Warnings.Add($"Line height format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate letter spacing
            var letterSpacingProps = typeof(TypographyConfig).GetProperties().Where(p => p.Name.StartsWith("LetterSpacing"));
            foreach (var prop in letterSpacingProps)
            {
                var value = prop.GetValue(typography) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidLetterSpacing(value))
                {
                    result.Warnings.Add($"Letter spacing format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateSpacing(SpacingConfig spacing, ValidationResult result)
        {
            var spacingProps = typeof(SpacingConfig).GetProperties();
            foreach (var prop in spacingProps)
            {
                var value = prop.GetValue(spacing) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidSpacing(value))
                {
                    result.Warnings.Add($"Spacing format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateBorders(BorderConfig borders, ValidationResult result)
        {
            // Validate border widths
            var borderWidthProps = typeof(BorderConfig).GetProperties().Where(p => p.Name.StartsWith("BorderWidth"));
            foreach (var prop in borderWidthProps)
            {
                var value = prop.GetValue(borders) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidBorderWidth(value))
                {
                    result.Warnings.Add($"Border width format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate border radius
            var borderRadiusProps = typeof(BorderConfig).GetProperties().Where(p => p.Name.StartsWith("BorderRadius"));
            foreach (var prop in borderRadiusProps)
            {
                var value = prop.GetValue(borders) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidBorderRadius(value))
                {
                    result.Warnings.Add($"Border radius format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate border styles
            var borderStyleProps = typeof(BorderConfig).GetProperties().Where(p => p.Name.StartsWith("BorderStyle"));
            foreach (var prop in borderStyleProps)
            {
                var value = prop.GetValue(borders) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidBorderStyle(value))
                {
                    result.Warnings.Add($"Border style format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateShadows(ShadowConfig shadows, ValidationResult result)
        {
            var shadowProps = typeof(ShadowConfig).GetProperties();
            foreach (var prop in shadowProps)
            {
                var value = prop.GetValue(shadows) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidShadow(value))
                {
                    result.Warnings.Add($"Shadow format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateLayout(LayoutConfig layout, ValidationResult result)
        {
            // Validate container properties
            var containerProps = new[] { "ContainerMaxWidth", "ContainerPadding", "ContainerMargin" };
            foreach (var prop in containerProps)
            {
                var value = typeof(LayoutConfig).GetProperty(prop)?.GetValue(layout) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidLayoutValue(value))
                {
                    result.Warnings.Add($"Layout format warning for {prop}: {value}");
                }
            }
            
            // Validate z-index values
            var zIndexProps = typeof(LayoutConfig).GetProperties().Where(p => p.Name.StartsWith("ZIndex"));
            foreach (var prop in zIndexProps)
            {
                var value = prop.GetValue(layout) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidZIndex(value))
                {
                    result.Warnings.Add($"Z-index format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate breakpoints
            var breakpointProps = typeof(LayoutConfig).GetProperties().Where(p => p.Name.StartsWith("Breakpoint"));
            foreach (var prop in breakpointProps)
            {
                var value = prop.GetValue(layout) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidBreakpoint(value))
                {
                    result.Warnings.Add($"Breakpoint format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate grid properties
            var gridProps = typeof(LayoutConfig).GetProperties().Where(p => p.Name.StartsWith("Grid"));
            foreach (var prop in gridProps)
            {
                var value = prop.GetValue(layout) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidGridValue(value))
                {
                    result.Warnings.Add($"Grid format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateAnimations(AnimationConfig animations, ValidationResult result)
        {
            // Validate durations
            var durationProps = typeof(AnimationConfig).GetProperties().Where(p => p.Name.StartsWith("Duration"));
            foreach (var prop in durationProps)
            {
                var value = prop.GetValue(animations) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidDuration(value))
                {
                    result.Warnings.Add($"Duration format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate easing functions
            var easeProps = typeof(AnimationConfig).GetProperties().Where(p => p.Name.StartsWith("Ease"));
            foreach (var prop in easeProps)
            {
                var value = prop.GetValue(animations) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidEasing(value))
                {
                    result.Warnings.Add($"Easing format warning for {prop.Name}: {value}");
                }
            }
            
            // Validate transitions
            var transitionProps = typeof(AnimationConfig).GetProperties().Where(p => p.Name.StartsWith("Transition"));
            foreach (var prop in transitionProps)
            {
                var value = prop.GetValue(animations) as string;
                if (!string.IsNullOrEmpty(value) && !IsValidTransition(value))
                {
                    result.Warnings.Add($"Transition format warning for {prop.Name}: {value}");
                }
            }
        }
        
        private void ValidateComponents(ComponentConfig components, ValidationResult result)
        {
            // Validate Button
            ValidateButtonConfig(components.Button, result);
            
            // Validate Input
            ValidateInputConfig(components.Input, result);
            
            // Validate Form Controls
            ValidateFormControlConfig(components.FormControl, result);
            
            // Validate Window
            ValidateWindowConfig(components.Window, result);
            
            // Validate Navigation
            ValidateNavigationConfig(components.Navigation, result);
            
            // Validate Overlay
            ValidateOverlayConfig(components.Overlay, result);
            
            // Validate Scrollbar
            ValidateScrollbarConfig(components.Scrollbar, result);
        }
        
        private void ValidateButtonConfig(ButtonConfig button, ValidationResult result)
        {
            var buttonProps = typeof(ButtonConfig).GetProperties();
            foreach (var prop in buttonProps)
            {
                var value = prop.GetValue(button) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Button property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateInputConfig(InputConfig input, ValidationResult result)
        {
            var inputProps = typeof(InputConfig).GetProperties();
            foreach (var prop in inputProps)
            {
                var value = prop.GetValue(input) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Input property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateFormControlConfig(FormControlConfig formControl, ValidationResult result)
        {
            var formControlProps = typeof(FormControlConfig).GetProperties();
            foreach (var prop in formControlProps)
            {
                var value = prop.GetValue(formControl) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Form control property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateWindowConfig(WindowConfig window, ValidationResult result)
        {
            var windowProps = typeof(WindowConfig).GetProperties();
            foreach (var prop in windowProps)
            {
                var value = prop.GetValue(window) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Window property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateNavigationConfig(NavigationConfig navigation, ValidationResult result)
        {
            var navigationProps = typeof(NavigationConfig).GetProperties();
            foreach (var prop in navigationProps)
            {
                var value = prop.GetValue(navigation) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Navigation property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateOverlayConfig(OverlayConfig overlay, ValidationResult result)
        {
            var overlayProps = typeof(OverlayConfig).GetProperties();
            foreach (var prop in overlayProps)
            {
                var value = prop.GetValue(overlay) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Overlay property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateScrollbarConfig(ScrollbarConfig scrollbar, ValidationResult result)
        {
            var scrollbarProps = typeof(ScrollbarConfig).GetProperties();
            foreach (var prop in scrollbarProps)
            {
                var value = prop.GetValue(scrollbar) as string;
                if (!string.IsNullOrEmpty(value))
                {
                    if (!IsValidComponentValue(value, prop.Name))
                    {
                        result.Warnings.Add($"Scrollbar property format warning for {prop.Name}: {value}");
                    }
                }
            }
        }
        
        private void ValidateRules(List<ThemeRule> rules, ValidationResult result)
        {
            foreach (var rule in rules)
            {
                if (string.IsNullOrEmpty(rule.Name))
                {
                    result.Errors.Add("Rule name is required");
                }
                
                if (string.IsNullOrEmpty(rule.Description))
                {
                    result.Warnings.Add($"Description is recommended for rule: {rule.Name}");
                }
                
                if (string.IsNullOrEmpty(rule.Category))
                {
                    result.Warnings.Add($"Category is recommended for rule: {rule.Name}");
                }
                else if (!new[] { "required", "recommended", "optional" }.Contains(rule.Category.ToLower()))
                {
                    result.Warnings.Add($"Invalid category for rule {rule.Name}: {rule.Category}");
                }
            }
        }
        
        // Validation helper methods - More permissive validation
        private bool IsValidColor(string value)
        {
            // Hex colors
            if (Regex.IsMatch(value, @"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$"))
                return true;
            
            // RGB/RGBA colors
            if (Regex.IsMatch(value, @"^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$"))
                return true;
            
            // HSL/HSLA colors
            if (Regex.IsMatch(value, @"^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)$"))
                return true;
            
            // Named colors
            var namedColors = new[] { "transparent", "currentColor", "inherit", "initial", "unset" };
            if (namedColors.Contains(value.ToLower()))
                return true;
            
            // Allow hex with alpha (like #ebebf599)
            if (Regex.IsMatch(value, @"^#[A-Fa-f0-9]{8}$"))
                return true;
            
            return false;
        }
        
        private bool IsValidFontFamily(string value)
        {
            // More permissive font family validation
            return !string.IsNullOrEmpty(value) && value.Length <= 500;
        }
        
        private bool IsValidFontSize(string value)
        {
            // Pixels, em, rem, %, vw, vh, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|%|vw|vh|vmin|vmax|pt|pc|in|cm|mm)?$") || 
                   value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidFontWeight(string value)
        {
            var validWeights = new[] { "normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "inherit", "initial", "unset" };
            return validWeights.Contains(value);
        }
        
        private bool IsValidLineHeight(string value)
        {
            // Numbers, pixels, em, rem, %, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|%)?$") || 
                   value == "normal" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidLetterSpacing(string value)
        {
            // Pixels, em, rem, etc.
            return Regex.IsMatch(value, @"^[\d.-]+(px|em|rem)?$") || 
                   value == "normal" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidSpacing(string value)
        {
            // Pixels, em, rem, %, vw, vh, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|%|vw|vh|vmin|vmax|pt|pc|in|cm|mm)?$") || 
                   value == "0" || value == "auto" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidBorderWidth(string value)
        {
            // Pixels, em, rem, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|pt|pc|in|cm|mm)?$") || 
                   value == "thin" || value == "medium" || value == "thick" || 
                   value == "0" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidBorderRadius(string value)
        {
            // Pixels, em, rem, %, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|%)?$") || 
                   value == "0" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidBorderStyle(string value)
        {
            var validStyles = new[] { "none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "inherit", "initial", "unset" };
            return validStyles.Contains(value);
        }
        
        private bool IsValidShadow(string value)
        {
            // More permissive shadow validation
            if (value == "none" || value == "inherit" || value == "initial" || value == "unset")
                return true;
            
            // Allow complex shadow strings
            return !string.IsNullOrEmpty(value) && value.Length <= 500;
        }
        
        private bool IsValidLayoutValue(string value)
        {
            // Pixels, em, rem, %, vw, vh, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem|%|vw|vh|vmin|vmax|pt|pc|in|cm|mm)?$") || 
                   value == "auto" || value == "none" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidZIndex(string value)
        {
            // Numbers or auto
            return Regex.IsMatch(value, @"^-?\d+$") || 
                   value == "auto" || value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidBreakpoint(string value)
        {
            // Pixels, em, rem, etc.
            return Regex.IsMatch(value, @"^[\d.]+(px|em|rem)$") || 
                   value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidGridValue(string value)
        {
            // Grid values can be complex
            return !string.IsNullOrEmpty(value) && value.Length <= 200;
        }
        
        private bool IsValidDuration(string value)
        {
            // Milliseconds, seconds
            return Regex.IsMatch(value, @"^[\d.]+(ms|s)?$") || 
                   value == "inherit" || value == "initial" || value == "unset";
        }
        
        private bool IsValidEasing(string value)
        {
            var validEasing = new[] { "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end", "inherit", "initial", "unset" };
            return validEasing.Contains(value) || Regex.IsMatch(value, @"^cubic-bezier\([\d.,\s]+\)$");
        }
        
        private bool IsValidTransition(string value)
        {
            // Complex transition validation - more permissive
            return !string.IsNullOrEmpty(value) && value.Length <= 500;
        }
        
        private bool IsValidComponentValue(string value, string propertyName)
        {
            // Component-specific validation based on property type
            if (propertyName.Contains("Color") || propertyName.Contains("Background"))
                return IsValidColor(value);
            
            if (propertyName.Contains("Size") || propertyName.Contains("Width") || propertyName.Contains("Height"))
                return IsValidSpacing(value);
            
            if (propertyName.Contains("Padding") || propertyName.Contains("Margin"))
                return IsValidSpacing(value);
            
            if (propertyName.Contains("BorderRadius"))
                return IsValidBorderRadius(value);
            
            if (propertyName.Contains("BorderWidth"))
                return IsValidBorderWidth(value);
            
            if (propertyName.Contains("FontSize"))
                return IsValidFontSize(value);
            
            if (propertyName.Contains("FontWeight"))
                return IsValidFontWeight(value);
            
            if (propertyName.Contains("Shadow"))
                return IsValidShadow(value);
            
            if (propertyName.Contains("Opacity"))
                return Regex.IsMatch(value, @"^[\d.]+$") || value == "inherit" || value == "initial" || value == "unset";
            
            if (propertyName.Contains("Transition"))
                return IsValidTransition(value);
            
            // Default validation for other properties - more permissive
            return !string.IsNullOrEmpty(value) && value.Length <= 200;
        }
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }
} 