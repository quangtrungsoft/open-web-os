using System.Threading.Tasks;

namespace MyDesktop.Client.Services.SystemServices
{
    public interface IRuleEngineService
    {
        Task<bool> EvaluateRuleAsync(string ruleName, object context);
        Task<bool> AddRuleAsync(string ruleName, string ruleDefinition);
        Task<bool> RemoveRuleAsync(string ruleName);
    }
}