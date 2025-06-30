using MyDesktop.Components;
using MyDesktop.Client.Services.Kernel;
using MyDesktop.Client.Services.SystemServices;
using MyDesktop.Client.Services.PluginHost;
using MyDesktop.Services.SystemServices;
using MyDesktop.Client.Themes;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveWebAssemblyComponents();

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

// Register SignalR for real-time communication
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(MyDesktop.Client._Imports).Assembly);

// Map SignalR hub
app.MapHub<EventBusHub>("/eventbus");

app.Run();
