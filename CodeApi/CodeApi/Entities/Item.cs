using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CodeApi.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public int ItemTypeId { get; set; }
        public string Name { get; set; }
        public int StorageAmount { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }

        [ForeignKey(nameof(ItemTypeId))]
        public virtual ItemType ItemType { get; set; }
    }
}
