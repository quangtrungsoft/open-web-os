namespace MyDesktop.Client.Services.Kernel
{
    public interface INetworkManager
    {
        Task<bool> ConnectAsync(string endpoint);
        Task<bool> DisconnectAsync();
        Task<bool> SendDataAsync(byte[] data);
        Task<byte[]> ReceiveDataAsync();
    }
}