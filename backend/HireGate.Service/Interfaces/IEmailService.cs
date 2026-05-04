using HireGate.Data.Models;
using HireGate.Service.DTOs;
public interface IEmailService
{
    Task SendEmail(string to, string subject, string body);
}