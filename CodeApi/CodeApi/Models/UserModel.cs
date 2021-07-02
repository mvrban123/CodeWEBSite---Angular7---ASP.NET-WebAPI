using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Models
{
    public class UserModel
    {
        public UserInfo UserInfo { get; set; }
        public CompanyInfo CompanyInfo { get; set; }
    }

    public class UserInfo
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class CompanyInfo
    {
        public string UserId { get; set; }
        public string CompanyName { get; set; }
        public string Oib { get; set; }
        public string Address { get; set; }
        public string PostalNumber { get; set; }
        public string City { get; set; }
    }
}
