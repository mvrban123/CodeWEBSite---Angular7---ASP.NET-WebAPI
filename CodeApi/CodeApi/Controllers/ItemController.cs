using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeApi.Data;
using CodeApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ItemController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Item
        [HttpGet("{itemTypeId?}")]
        public async Task<IEnumerable<Item>> GetItems(int? itemTypeId = null)
        {
            var items = _context.Item.AsQueryable();

            if (itemTypeId.HasValue)
                items = items.Where(it => it.ItemTypeId == itemTypeId).AsQueryable();

            return await items.Include(it => it.ItemType).ToListAsync();
        }

        // GET: api/Item/GetItem/1
        [HttpGet]
        [Route("GetItem/{itemId}")]
        public ActionResult<Item> GetItem(int itemId)
        {
            var item = _context.Item.FirstOrDefault(it => it.Id == itemId);

            if (item == null)
                return NotFound();

            return item;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateItem([FromBody] Item item)
        {
            item.StorageAmount = 0;

            try
            {
                _context.Item.Add(item);
                _context.SaveChanges();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        // POST: api/Item/Update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateItem(int id, Item item)
        {
            if (id != item.Id)
                return BadRequest();

            _context.Entry(item).State = EntityState.Modified;
            _context.Entry(item).Property(it => it.ImageUrl).IsModified = false; // Exclude from update

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Item>> DeleteItem(int id)
        {
            var item = _context.Item.FirstOrDefault(it => it.Id == id);
            if (item == null)
                return NotFound();

            _context.Item.Remove(item);
            await _context.SaveChangesAsync();

            return item;
        }
    }
}