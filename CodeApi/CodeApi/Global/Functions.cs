using CodeApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CodeApi.Global
{
    public static class Functions
    {
        public static void SendMail(ContactModel model)
        {
            var fromAddress = new MailAddress("dokumenti.codeit@gmail.com", "Code-iT Mail");
            var toAddress = new MailAddress("valentino@code-it.hr", "Prodaja Code-iT");

            string fromPassword = "Dejan102";
            string body = model.Message;

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = model.Subject,
                Body = body
            };
            smtp.Send(message);
            smtp.Dispose();
        }
    }
}
