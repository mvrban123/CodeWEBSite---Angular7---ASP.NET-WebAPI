using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Models
{
    public class ContactModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
