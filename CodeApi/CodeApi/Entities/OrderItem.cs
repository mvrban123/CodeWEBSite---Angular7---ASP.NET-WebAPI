using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ItemId { get; set; }
        public int Amount { get; set; }

        [ForeignKey(nameof(OrderId))]
        public virtual Order Order { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item Item { get; set; }
    }
}
