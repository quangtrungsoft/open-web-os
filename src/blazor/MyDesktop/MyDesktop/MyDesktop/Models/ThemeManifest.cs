using System.Collections.Generic;

namespace MyDesktop.Models
{
    public class ThemeManifest
    {
        public string ThemeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool DarkMode { get; set; }
        
        // Design System Variables
        public DesignSystem DesignSystem { get; set; } = new();
        
        // Component-specific overrides (optional)
        public Dictionary<string, Dictionary<string, string>> Components { get; set; } = new();
        
        // Theme rules for validation
        public List<ThemeRule> Rules { get; set; } = new();
    }

    public class DesignSystem
    {
        // Color Palette
        public ColorPalette Colors { get; set; } = new();
        
        // Typography
        public TypographyConfig Typography { get; set; } = new();
        
        // Spacing System
        public SpacingConfig Spacing { get; set; } = new();
        
        // Border System
        public BorderConfig Borders { get; set; } = new();
        
        // Shadow System
        public ShadowConfig Shadows { get; set; } = new();
        
        // Layout System
        public LayoutConfig Layout { get; set; } = new();
        
        // Animation System
        public AnimationConfig Animations { get; set; } = new();
        
        // Component System
        public ComponentConfig Components { get; set; } = new();
    }

    public class ColorPalette
    {
        // Primary Colors
        public string Primary { get; set; } = "";
        public string PrimaryLight { get; set; } = "";
        public string PrimaryDark { get; set; } = "";
        public string PrimaryText { get; set; } = "";
        public string PrimaryHover { get; set; } = "";
        public string PrimaryActive { get; set; } = "";
        public string PrimaryDisabled { get; set; } = "";
        
        // Secondary Colors
        public string Secondary { get; set; } = "";
        public string SecondaryLight { get; set; } = "";
        public string SecondaryDark { get; set; } = "";
        public string SecondaryText { get; set; } = "";
        public string SecondaryHover { get; set; } = "";
        public string SecondaryActive { get; set; } = "";
        public string SecondaryDisabled { get; set; } = "";
        
        // Background Colors
        public string Background { get; set; } = "";
        public string BackgroundSecondary { get; set; } = "";
        public string BackgroundTertiary { get; set; } = "";
        public string BackgroundOverlay { get; set; } = "";
        public string BackgroundInverse { get; set; } = "";
        public string BackgroundGlass { get; set; } = "";
        
        // Text Colors
        public string TextPrimary { get; set; } = "";
        public string TextSecondary { get; set; } = "";
        public string TextTertiary { get; set; } = "";
        public string TextInverse { get; set; } = "";
        public string TextMuted { get; set; } = "";
        public string TextLink { get; set; } = "";
        public string TextLinkHover { get; set; } = "";
        public string TextSelection { get; set; } = "";
        
        // Border Colors
        public string BorderPrimary { get; set; } = "";
        public string BorderSecondary { get; set; } = "";
        public string BorderTertiary { get; set; } = "";
        public string BorderFocus { get; set; } = "";
        public string BorderError { get; set; } = "";
        public string BorderSuccess { get; set; } = "";
        public string BorderWarning { get; set; } = "";
        
        // Status Colors
        public string Success { get; set; } = "";
        public string SuccessLight { get; set; } = "";
        public string SuccessDark { get; set; } = "";
        public string SuccessText { get; set; } = "";
        public string Warning { get; set; } = "";
        public string WarningLight { get; set; } = "";
        public string WarningDark { get; set; } = "";
        public string WarningText { get; set; } = "";
        public string Error { get; set; } = "";
        public string ErrorLight { get; set; } = "";
        public string ErrorDark { get; set; } = "";
        public string ErrorText { get; set; } = "";
        public string Info { get; set; } = "";
        public string InfoLight { get; set; } = "";
        public string InfoDark { get; set; } = "";
        public string InfoText { get; set; } = "";
        
        // Interactive Colors
        public string Hover { get; set; } = "";
        public string Active { get; set; } = "";
        public string Focus { get; set; } = "";
        public string FocusRing { get; set; } = "";
        public string Disabled { get; set; } = "";
        public string DisabledText { get; set; } = "";
        public string DisabledBackground { get; set; } = "";
        public string DisabledBorder { get; set; } = "";
        
        // Surface Colors
        public string SurfacePrimary { get; set; } = "";
        public string SurfaceSecondary { get; set; } = "";
        public string SurfaceTertiary { get; set; } = "";
        public string SurfaceHover { get; set; } = "";
        public string SurfaceActive { get; set; } = "";
        public string SurfaceSelected { get; set; } = "";
        
        // Special Colors
        public string Accent { get; set; } = "";
        public string AccentLight { get; set; } = "";
        public string AccentDark { get; set; } = "";
        public string Highlight { get; set; } = "";
        public string HighlightText { get; set; } = "";
        public string Divider { get; set; } = "";
        public string Overlay { get; set; } = "";
        public string Backdrop { get; set; } = "";
    }

    public class TypographyConfig
    {
        // Font Families
        public string FontFamilyPrimary { get; set; } = "";
        public string FontFamilySecondary { get; set; } = "";
        public string FontFamilyMonospace { get; set; } = "";
        public string FontFamilyDisplay { get; set; } = "";
        
        // Font Sizes
        public string FontSizeXs { get; set; } = "";
        public string FontSizeSm { get; set; } = "";
        public string FontSizeBase { get; set; } = "";
        public string FontSizeLg { get; set; } = "";
        public string FontSizeXl { get; set; } = "";
        public string FontSize2xl { get; set; } = "";
        public string FontSize3xl { get; set; } = "";
        public string FontSize4xl { get; set; } = "";
        public string FontSize5xl { get; set; } = "";
        public string FontSize6xl { get; set; } = "";
        
        // Font Weights
        public string FontWeightThin { get; set; } = "";
        public string FontWeightLight { get; set; } = "";
        public string FontWeightNormal { get; set; } = "";
        public string FontWeightMedium { get; set; } = "";
        public string FontWeightSemibold { get; set; } = "";
        public string FontWeightBold { get; set; } = "";
        public string FontWeightExtrabold { get; set; } = "";
        public string FontWeightBlack { get; set; } = "";
        
        // Line Heights
        public string LineHeightNone { get; set; } = "";
        public string LineHeightTight { get; set; } = "";
        public string LineHeightSnug { get; set; } = "";
        public string LineHeightNormal { get; set; } = "";
        public string LineHeightRelaxed { get; set; } = "";
        public string LineHeightLoose { get; set; } = "";
        
        // Letter Spacing
        public string LetterSpacingTighter { get; set; } = "";
        public string LetterSpacingTight { get; set; } = "";
        public string LetterSpacingNormal { get; set; } = "";
        public string LetterSpacingWide { get; set; } = "";
        public string LetterSpacingWider { get; set; } = "";
        public string LetterSpacingWidest { get; set; } = "";
        
        // Text Decoration
        public string TextDecorationUnderline { get; set; } = "";
        public string TextDecorationLineThrough { get; set; } = "";
        public string TextDecorationNone { get; set; } = "";
    }

    public class SpacingConfig
    {
        // Base Spacing
        public string Spacing0 { get; set; } = "";
        public string Spacing1 { get; set; } = "";
        public string Spacing2 { get; set; } = "";
        public string Spacing3 { get; set; } = "";
        public string Spacing4 { get; set; } = "";
        public string Spacing5 { get; set; } = "";
        public string Spacing6 { get; set; } = "";
        public string Spacing8 { get; set; } = "";
        public string Spacing10 { get; set; } = "";
        public string Spacing12 { get; set; } = "";
        public string Spacing16 { get; set; } = "";
        public string Spacing20 { get; set; } = "";
        public string Spacing24 { get; set; } = "";
        public string Spacing32 { get; set; } = "";
        public string Spacing40 { get; set; } = "";
        public string Spacing48 { get; set; } = "";
        public string Spacing56 { get; set; } = "";
        public string Spacing64 { get; set; } = "";
        public string Spacing80 { get; set; } = "";
        public string Spacing96 { get; set; } = "";
        public string Spacing128 { get; set; } = "";
        
        // Component Spacing
        public string PaddingXs { get; set; } = "";
        public string PaddingSm { get; set; } = "";
        public string PaddingMd { get; set; } = "";
        public string PaddingLg { get; set; } = "";
        public string PaddingXl { get; set; } = "";
        public string Padding2xl { get; set; } = "";
        
        public string MarginXs { get; set; } = "";
        public string MarginSm { get; set; } = "";
        public string MarginMd { get; set; } = "";
        public string MarginLg { get; set; } = "";
        public string MarginXl { get; set; } = "";
        public string Margin2xl { get; set; } = "";
        
        // Gap Spacing
        public string GapXs { get; set; } = "";
        public string GapSm { get; set; } = "";
        public string GapMd { get; set; } = "";
        public string GapLg { get; set; } = "";
        public string GapXl { get; set; } = "";
        public string Gap2xl { get; set; } = "";
        
        // Inset Spacing
        public string InsetXs { get; set; } = "";
        public string InsetSm { get; set; } = "";
        public string InsetMd { get; set; } = "";
        public string InsetLg { get; set; } = "";
        public string InsetXl { get; set; } = "";
    }

    public class BorderConfig
    {
        // Border Widths
        public string BorderWidth0 { get; set; } = "";
        public string BorderWidth1 { get; set; } = "";
        public string BorderWidth2 { get; set; } = "";
        public string BorderWidth4 { get; set; } = "";
        public string BorderWidth8 { get; set; } = "";
        
        // Border Radius
        public string BorderRadiusNone { get; set; } = "";
        public string BorderRadiusSm { get; set; } = "";
        public string BorderRadiusMd { get; set; } = "";
        public string BorderRadiusLg { get; set; } = "";
        public string BorderRadiusXl { get; set; } = "";
        public string BorderRadius2xl { get; set; } = "";
        public string BorderRadius3xl { get; set; } = "";
        public string BorderRadiusFull { get; set; } = "";
        
        // Border Styles
        public string BorderStyleSolid { get; set; } = "";
        public string BorderStyleDashed { get; set; } = "";
        public string BorderStyleDotted { get; set; } = "";
        public string BorderStyleDouble { get; set; } = "";
        public string BorderStyleNone { get; set; } = "";
    }

    public class ShadowConfig
    {
        // Shadow Levels
        public string ShadowSm { get; set; } = "";
        public string ShadowMd { get; set; } = "";
        public string ShadowLg { get; set; } = "";
        public string ShadowXl { get; set; } = "";
        public string Shadow2xl { get; set; } = "";
        public string ShadowInner { get; set; } = "";
        public string ShadowNone { get; set; } = "";
        
        // Component Shadows
        public string ShadowButton { get; set; } = "";
        public string ShadowCard { get; set; } = "";
        public string ShadowModal { get; set; } = "";
        public string ShadowTooltip { get; set; } = "";
        public string ShadowDropdown { get; set; } = "";
        public string ShadowWindow { get; set; } = "";
    }

    public class LayoutConfig
    {
        // Container
        public string ContainerMaxWidth { get; set; } = "";
        public string ContainerPadding { get; set; } = "";
        public string ContainerMargin { get; set; } = "";
        
        // Z-Index
        public string ZIndexDropdown { get; set; } = "";
        public string ZIndexSticky { get; set; } = "";
        public string ZIndexFixed { get; set; } = "";
        public string ZIndexModal { get; set; } = "";
        public string ZIndexPopover { get; set; } = "";
        public string ZIndexTooltip { get; set; } = "";
        public string ZIndexToast { get; set; } = "";
        public string ZIndexOverlay { get; set; } = "";
        public string ZIndexWindow { get; set; } = "";
        
        // Breakpoints
        public string BreakpointSm { get; set; } = "";
        public string BreakpointMd { get; set; } = "";
        public string BreakpointLg { get; set; } = "";
        public string BreakpointXl { get; set; } = "";
        public string Breakpoint2xl { get; set; } = "";
        
        // Grid
        public string GridColumns { get; set; } = "";
        public string GridGap { get; set; } = "";
        public string GridRowGap { get; set; } = "";
        public string GridColGap { get; set; } = "";
    }

    public class AnimationConfig
    {
        // Duration
        public string Duration75 { get; set; } = "";
        public string Duration100 { get; set; } = "";
        public string Duration150 { get; set; } = "";
        public string Duration200 { get; set; } = "";
        public string Duration300 { get; set; } = "";
        public string Duration500 { get; set; } = "";
        public string Duration700 { get; set; } = "";
        public string Duration1000 { get; set; } = "";
        
        // Easing
        public string EaseLinear { get; set; } = "";
        public string EaseIn { get; set; } = "";
        public string EaseOut { get; set; } = "";
        public string EaseInOut { get; set; } = "";
        public string EaseInQuad { get; set; } = "";
        public string EaseOutQuad { get; set; } = "";
        public string EaseInOutQuad { get; set; } = "";
        
        // Transitions
        public string TransitionAll { get; set; } = "";
        public string TransitionColors { get; set; } = "";
        public string TransitionOpacity { get; set; } = "";
        public string TransitionShadow { get; set; } = "";
        public string TransitionTransform { get; set; } = "";
    }

    public class ComponentConfig
    {
        // Button
        public ButtonConfig Button { get; set; } = new();
        
        // Input
        public InputConfig Input { get; set; } = new();
        
        // Form Controls
        public FormControlConfig FormControl { get; set; } = new();
        
        // Window
        public WindowConfig Window { get; set; } = new();
        
        // Navigation
        public NavigationConfig Navigation { get; set; } = new();
        
        // Overlay
        public OverlayConfig Overlay { get; set; } = new();
        
        // Scrollbar
        public ScrollbarConfig Scrollbar { get; set; } = new();
    }

    public class ButtonConfig
    {
        public string Height { get; set; } = "";
        public string MinWidth { get; set; } = "";
        public string PaddingX { get; set; } = "";
        public string PaddingY { get; set; } = "";
        public string FontSize { get; set; } = "";
        public string FontWeight { get; set; } = "";
        public string BorderRadius { get; set; } = "";
        public string BorderWidth { get; set; } = "";
        public string Transition { get; set; } = "";
        public string FocusRing { get; set; } = "";
        public string FocusRingOffset { get; set; } = "";
        public string DisabledOpacity { get; set; } = "";
        public string LoadingSpinnerSize { get; set; } = "";
    }

    public class InputConfig
    {
        public string Height { get; set; } = "";
        public string PaddingX { get; set; } = "";
        public string PaddingY { get; set; } = "";
        public string FontSize { get; set; } = "";
        public string BorderRadius { get; set; } = "";
        public string BorderWidth { get; set; } = "";
        public string Transition { get; set; } = "";
        public string FocusRing { get; set; } = "";
        public string FocusRingOffset { get; set; } = "";
        public string PlaceholderOpacity { get; set; } = "";
        public string DisabledOpacity { get; set; } = "";
        public string IconSize { get; set; } = "";
        public string IconSpacing { get; set; } = "";
    }

    public class FormControlConfig
    {
        // Checkbox
        public string CheckboxSize { get; set; } = "";
        public string CheckboxBorderRadius { get; set; } = "";
        public string CheckboxTransition { get; set; } = "";
        public string CheckboxFocusRing { get; set; } = "";
        public string CheckboxIndeterminateOpacity { get; set; } = "";
        
        // Radio
        public string RadioSize { get; set; } = "";
        public string RadioBorderRadius { get; set; } = "";
        public string RadioTransition { get; set; } = "";
        public string RadioFocusRing { get; set; } = "";
        public string RadioDotSize { get; set; } = "";
        
        // Switch
        public string SwitchWidth { get; set; } = "";
        public string SwitchHeight { get; set; } = "";
        public string SwitchBorderRadius { get; set; } = "";
        public string SwitchTransition { get; set; } = "";
        public string SwitchThumbSize { get; set; } = "";
        public string SwitchFocusRing { get; set; } = "";
        
        // Select
        public string SelectArrowSize { get; set; } = "";
        public string SelectArrowSpacing { get; set; } = "";
        public string SelectOptionPadding { get; set; } = "";
        public string SelectOptionHover { get; set; } = "";
        public string SelectOptionSelected { get; set; } = "";
        
        // Textarea
        public string TextareaMinHeight { get; set; } = "";
        public string TextareaResize { get; set; } = "";
        public string TextareaLineHeight { get; set; } = "";
    }

    public class WindowConfig
    {
        public string TitleBarHeight { get; set; } = "";
        public string TitleBarPadding { get; set; } = "";
        public string TitleBarFontSize { get; set; } = "";
        public string TitleBarFontWeight { get; set; } = "";
        public string TitleBarBackground { get; set; } = "";
        public string TitleBarBorderBottom { get; set; } = "";
        public string WindowBorderRadius { get; set; } = "";
        public string WindowShadow { get; set; } = "";
        public string WindowMinWidth { get; set; } = "";
        public string WindowMinHeight { get; set; } = "";
        public string WindowMaxWidth { get; set; } = "";
        public string WindowMaxHeight { get; set; } = "";
        public string WindowResizeHandle { get; set; } = "";
        public string WindowBackdropFilter { get; set; } = "";
    }

    public class NavigationConfig
    {
        // Menu
        public string MenuBackground { get; set; } = "";
        public string MenuBorderRadius { get; set; } = "";
        public string MenuShadow { get; set; } = "";
        public string MenuPadding { get; set; } = "";
        public string MenuItemPadding { get; set; } = "";
        public string MenuItemBorderRadius { get; set; } = "";
        public string MenuItemHover { get; set; } = "";
        public string MenuItemActive { get; set; } = "";
        public string MenuItemSelected { get; set; } = "";
        public string MenuItemDisabled { get; set; } = "";
        public string MenuDivider { get; set; } = "";
        
        // Breadcrumb
        public string BreadcrumbSeparator { get; set; } = "";
        public string BreadcrumbSeparatorSpacing { get; set; } = "";
        public string BreadcrumbItemHover { get; set; } = "";
        public string BreadcrumbItemActive { get; set; } = "";
        
        // Pagination
        public string PaginationItemSize { get; set; } = "";
        public string PaginationItemBorderRadius { get; set; } = "";
        public string PaginationItemHover { get; set; } = "";
        public string PaginationItemActive { get; set; } = "";
        public string PaginationItemDisabled { get; set; } = "";
    }

    public class OverlayConfig
    {
        public string ModalBackdrop { get; set; } = "";
        public string ModalBackdropBlur { get; set; } = "";
        public string ModalBackground { get; set; } = "";
        public string ModalBorderRadius { get; set; } = "";
        public string ModalShadow { get; set; } = "";
        public string ModalPadding { get; set; } = "";
        public string ModalMaxWidth { get; set; } = "";
        public string ModalMaxHeight { get; set; } = "";
        public string ModalCloseButtonSize { get; set; } = "";
        public string ModalCloseButtonSpacing { get; set; } = "";
        
        public string TooltipBackground { get; set; } = "";
        public string TooltipBorderRadius { get; set; } = "";
        public string TooltipShadow { get; set; } = "";
        public string TooltipPadding { get; set; } = "";
        public string TooltipMaxWidth { get; set; } = "";
        public string TooltipArrowSize { get; set; } = "";
        
        public string PopoverBackground { get; set; } = "";
        public string PopoverBorderRadius { get; set; } = "";
        public string PopoverShadow { get; set; } = "";
        public string PopoverPadding { get; set; } = "";
        public string PopoverMaxWidth { get; set; } = "";
        public string PopoverArrowSize { get; set; } = "";
    }

    public class ScrollbarConfig
    {
        public string ScrollbarWidth { get; set; } = "";
        public string ScrollbarHeight { get; set; } = "";
        public string ScrollbarBorderRadius { get; set; } = "";
        public string ScrollbarTrackBackground { get; set; } = "";
        public string ScrollbarThumbBackground { get; set; } = "";
        public string ScrollbarThumbHover { get; set; } = "";
        public string ScrollbarThumbActive { get; set; } = "";
        public string ScrollbarThumbBorderRadius { get; set; } = "";
        public string ScrollbarThumbMinHeight { get; set; } = "";
        public string ScrollbarThumbMinWidth { get; set; } = "";
    }

    public class ThemeRule
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // "required", "recommended", "optional"
        public int? Min { get; set; }
        public int? Max { get; set; }
    }
} 