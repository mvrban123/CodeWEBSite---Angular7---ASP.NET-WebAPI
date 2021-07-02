using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using CodeApi.Models;
using System.Net;

namespace CodeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        // POST: api/Contact/SendMessage
        [HttpPost]
        [Route("SendMessage")]
        public IActionResult SendMessage([FromBody] ContactModel model)
        {
            try
            {
                model.Subject = $"WebShop - Kontakt - {model.FullName}";
                Global.Functions.SendMail(model);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}