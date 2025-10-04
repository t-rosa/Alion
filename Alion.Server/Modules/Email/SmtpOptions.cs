namespace Alion.Server.Modules.Email;

public class SmtpOptions
{
    public string Server { get; set; } = default!;
    public int Port { get; set; }
    public bool EnableSSL { get; set; }
}
