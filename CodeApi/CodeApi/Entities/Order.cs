using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int StatusId{ get; set; }
        public DateTime OrderDate { get; set; }
        public bool Delivery { get; set; }
        public string InvoiceLocation { get; set; }
        public string WarrantyLocation { get; set; }
        public List<OrderItem> OrderItems { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }

        [ForeignKey(nameof(StatusId))]
        public virtual Status Status { get; set; }
    }
}
