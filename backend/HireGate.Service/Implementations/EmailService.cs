using MailKit.Net.Smtp;
using MimeKit;
// using Org.BouncyCastle.Security;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Text.RegularExpressions;

namespace HireGate.Service.Implementations
{
public class EmailService : IEmailService{

    private readonly IConfiguration _configuration;
    private static readonly Regex UrlRegex = new(@"(?:https?://)?(?:localhost:\d+|[\w.-]+\.[a-z]{2,})(?:/[^\s<]*)?", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private static string GetActionUrl(string body)
    {
        var match = UrlRegex.Match(body);

        if (!match.Success)
        {
            return string.Empty;
        }

        var url = match.Value.Trim();
        return url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            ? url
            : $"http://{url}";
    }

    private static string FormatHtmlLines(string body)
    {
        var encoded = WebUtility.HtmlEncode(body);

        return encoded
            .Replace("\r\n", "<br>")
            .Replace("\n", "<br>");
    }

    private static string BuildHtmlEmail(string subject, string body)
    {
        var actionUrl = GetActionUrl(body);
        var encodedSubject = WebUtility.HtmlEncode(subject);
        var htmlBody = FormatHtmlLines(body);
        var buttonHtml = string.IsNullOrWhiteSpace(actionUrl)
            ? string.Empty
            : $"""
              <div style="margin: 28px 0 8px;">
                <a href="{WebUtility.HtmlEncode(actionUrl)}" style="display: inline-block; border-radius: 10px; background: #2563eb; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 13px 20px;">Open HireGate</a>
              </div>
              """;

        return $"""
        <!doctype html>
        <html>
          <body style="margin: 0; padding: 0; background: #f8fafc; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
            <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
              {encodedSubject}
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; padding: 32px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);">
                    <tr>
                      <td style="padding: 24px 28px; background: #0f172a;">
                        <div style="font-size: 22px; line-height: 1; font-weight: 800; color: #ffffff;">HireGate</div>
                        <div style="margin-top: 6px; font-size: 13px; color: #bfdbfe;">HR Exam Platform</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px 28px 28px;">
                        <h1 style="margin: 0 0 16px; font-size: 22px; line-height: 1.3; color: #0f172a;">{encodedSubject}</h1>
                        <div style="font-size: 15px; line-height: 1.7; color: #334155;">
                          {htmlBody}
                        </div>
                        {buttonHtml}
                        <div style="margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 18px; font-size: 12px; line-height: 1.6; color: #64748b;">
                          This message was sent by HireGate. If you were not expecting it, you can safely ignore it.
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        """;
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

        email.Body = new BodyBuilder
        {
            TextBody = body,
            HtmlBody = BuildHtmlEmail(subject, body)
        }.ToMessageBody();

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
