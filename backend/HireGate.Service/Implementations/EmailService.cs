using MailKit.Net.Smtp;
using MimeKit;
// using Org.BouncyCastle.Security;
using Microsoft.Extensions.Configuration;

namespace HireGate.Service.Implementations
{
public class EmailService : IEmailService{

    private readonly IConfiguration _configuration;
    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmail(string to, string subject, string body)
    {
        var from = _configuration["Email:From"]
            ?? throw new Exception("Email:From is missing");

        var password = _configuration["Email:password"]
            ?? throw new Exception("Email:password is missing");
        
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress("HireGate", from));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;

        email.Body = new TextPart("plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        // FIX SSL issue (dev only if needed)
        smtp.CheckCertificateRevocation = false;

        await smtp.ConnectAsync(
            "smtp.gmail.com",
            587,
            MailKit.Security.SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            from,
            password
        );

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }

}
}