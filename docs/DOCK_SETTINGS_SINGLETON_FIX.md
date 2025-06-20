# Dock Settings Singleton Fix

## Problem
The dock settings window could be opened multiple times by clicking the dock settings button repeatedly, creating multiple instances of the same window. This was incorrect behavior as system settings windows should typically be singleton (only one instance allowed).

## Root Cause
The `DockSettingsProcessor` was being instantiated as a new object each time the dock settings button was clicked in the taskbar, without checking if a dock settings window was already open.

## Solution
Modified the `DockSettingsProcessor.open()` method to check for existing dock settings windows using the window manager before creating a new window.

### Implementation Details

1. **Window Manager Integration**: Used `window.windowManager.getAllWindows()` to iterate through all open windows
2. **Title-based Detection**: Checked for existing windows with the same title ("Dock Settings")
3. **Window State Handling**: If an existing window is found:
   - Restore the window if it's minimized
   - Focus the existing window
   - Return early without creating a new window
4. **Fallback**: If no existing window is found, proceed with normal window creation

### Code Changes

```javascript
open() {
    // Check if a dock settings window is already open using window manager
    if (window.windowManager) {
        const allWindows = window.windowManager.getAllWindows();
        for (const [windowId, windowData] of allWindows) {
            if (windowData.data.title === this.appName) {
                // If window is minimized, restore it first
                if (windowData.isMinimized) {
                    window.windowManager.restoreWindow(windowId);
                }
                // Focus the existing window instead of creating a new one
                window.windowManager.focusWindow(windowId);
                return;
            }
        }
    }
    
    // ... rest of window creation logic
}
```

## Benefits

1. **Prevents Multiple Windows**: Only one dock settings window can be open at a time
2. **Better UX**: Clicking the dock settings button when a window is already open focuses the existing window
3. **Resource Efficiency**: Reduces memory usage and DOM elements
4. **Consistent Behavior**: Matches expected behavior for system settings windows

## Testing

To test the fix:
1. Open the dock settings window
2. Click the dock settings button again
3. Verify that the existing window is focused instead of creating a new one
4. Minimize the dock settings window and click the button again
5. Verify that the window is restored and focused

## Files Modified

- `src/html/modules/core/taskbar/dock-settings.js` - Added singleton logic to `open()` method 