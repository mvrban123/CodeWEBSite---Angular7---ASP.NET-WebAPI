using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Models
{
    public class ChangeStatusModel
    {
        public int OrderId { get; set; }
        public int StatusId { get; set; }
    }
}
