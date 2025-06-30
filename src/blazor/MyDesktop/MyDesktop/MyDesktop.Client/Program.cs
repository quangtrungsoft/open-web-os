using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MyDesktop.Client.Services.Kernel;
using MyDesktop.Client.Services.PluginHost;
using MyDesktop.Client.Services.SystemServices;
using MyDesktop.Client.Themes;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Register Core Kernel Services
builder.Services.AddScoped<IKernelService, KernelService>();
builder.Services.AddScoped<IProcessScheduler, ProcessScheduler>();
builder.Services.AddScoped<IMemoryManager, MemoryManager>();
builder.Services.AddScoped<IFileSystemManager, FileSystemManager>();
builder.Services.AddScoped<IInputManager, InputManager>();
builder.Services.AddScoped<INetworkManager, NetworkManager>();
builder.Services.AddScoped<ISecurityGuard, SecurityGuard>();

// Register System Services
builder.Services.AddScoped<IEventBusService, EventBusService>();
builder.Services.AddScoped<IWindowManagerService, WindowManagerService>();
builder.Services.AddScoped<ThemeManagerService>();
builder.Services.AddScoped<IRuleEngineService, RuleEngineService>();
builder.Services.AddScoped<ITelemetryService, TelemetryService>();

// Register Plugin Host
builder.Services.AddScoped<IPluginHostService, PluginHostService>();

// Register theme
builder.Services.AddTransient<MacOSTheme>();
builder.Services.AddTransient<NightTheme>();

await builder.Build().RunAsync();
