using MailKit.Net.Smtp;
using MimeKit;

namespace HireGate.Service.Implementations
{
public class EmailService : IEmailService{
    public async Task SendEmail(string to, string subject, string body)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress("HireGate", "ranimmohareb650@gmail.com"));
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
            "ranimmohareb650@gmail.com",
            "npfh pewe cjgt nygr"
        );

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }

}
}