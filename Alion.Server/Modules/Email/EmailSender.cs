using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Alion.Server.Modules.Users;

namespace Alion.Server.Modules.Email;

public class EmailSender : IEmailSender<User>
{
    private readonly IOptions<SmtpOptions> _options;
    private readonly ILogger<EmailSender> _logger;
    private readonly IConfiguration _configuration;

    public EmailSender(IOptions<SmtpOptions> options, ILogger<EmailSender> logger, IConfiguration configuration)
    {
        _options = options;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        await Execute(subject, message, toEmail);
    }

    public async Task Execute(string subject, string message, string toEmail)
    {
        var username = _configuration["SMTP_USERNAME"];
        var password = _configuration["SMTP_PASSWORD"];

        if (username == null && password == null)
        {
            throw new Exception();
        }

        using SmtpClient client = new(_options.Value.Server, _options.Value.Port);
        client.Credentials = new NetworkCredential(
            username,
            password
        );
        client.EnableSsl = _options.Value.EnableSSL;

        MailMessage msg = new() { From = new MailAddress(username!) };

        msg.To.Add(toEmail);
        msg.Body = message;
        msg.Subject = subject;
        msg.IsBodyHtml = true;

        try
        {
            await client.SendMailAsync(msg);
            _logger.LogInformation($"Email sent to {toEmail}");
        }
        catch
        {
            _logger.LogError($"Failed to send email to {toEmail}");
        }
    }

    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Bienvenue ! Confirme ton compte";
        var body = $@"
            <h1>Bonjour {user.UserName},</h1>
            <p>Merci de t’être inscrit. Clique sur le lien ci-dessous pour activer ton compte :</p>
            <p><a href='{confirmationLink}'>Confirmer mon compte</a></p>";

        await Execute(subject, body, email);
        _logger.LogInformation("Mail de confirmation envoyé à {Email} avec lien {Link}", email, confirmationLink);
    }

    public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        var subject = "Réinitialisation du mot de passe";
        var body = $@"
            <p>Pour réinitialiser ton mot de passe, clique ici :</p>
            <p><a href='{resetLink}'>Réinitialiser</a></p>";

        _logger.LogInformation("Mail reset envoyé à {Email} avec lien {Link}", email, resetLink);
        await Execute(subject, body, email);
    }

    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Code de réinitialisation du mot de passe";
        var body = $"Ton code est : {resetCode}";

        _logger.LogInformation("Code reset envoyé à {Email} avec code {Code}", email, resetCode);
        await Execute(subject, body, email);
    }
}
