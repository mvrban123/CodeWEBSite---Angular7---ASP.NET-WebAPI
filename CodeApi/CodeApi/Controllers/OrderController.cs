using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CodeApi.Data;
using CodeApi.Entities;
using CodeApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public OrderController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("{userId?}")]
        [Authorize]
        public async Task<IEnumerable<Order>> GetOrders(string userId = null)
        {
            var orders = _context.Order.AsQueryable();

            if (userId != null)
                orders = orders.Where(it => it.UserId == userId).AsQueryable();

            return await orders
                .Include(it => it.Status)
                .Include(it => it.User)
                .OrderByDescending(it => it.OrderDate).ToListAsync();
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            try
            {
                _context.Order.Add(order);
                _context.SaveChanges();

                // Send notification mail
                ContactModel contactModel = new ContactModel
                {
                    Subject = $"WebShop - Nova narudžba - {order.Id}",
                    Message = $"Zaprimljena je nova narudžba pod brojem {order.Id}."
                };
                Global.Functions.SendMail(contactModel);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("OrderStatus")]
        public async Task<IActionResult> ChangeOrderStatus([FromBody] ChangeStatusModel model)
        {
            var order = await _context.Order.FirstOrDefaultAsync(it => it.Id == model.OrderId);

            if (order == null)
                return NotFound();

            order.StatusId = model.StatusId;
            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest();
            }
            
            return Ok();
        }

        [HttpGet]
        [Authorize]
        [Route("OrderItems/{orderId}")]
        public async Task<IEnumerable<OrderItem>> GetOrderItems(int orderId)
        {
            return await _context.OrderItem.Where(it => it.OrderId == orderId).Include(it => it.Item).ToListAsync();
        }

        [HttpDelete("{orderId}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var order = _context.Order.FirstOrDefault(it => it.Id == orderId);

            if (order == null)
                return NotFound();

            _context.Order.Remove(order);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("UploadFile/{orderId}/{document}")]
        public async Task<IActionResult> UploadFile(int orderId, string document, IFormFile file)
        {
            if (file.Length == 0)
                return BadRequest();

            var order = _context.Order.FirstOrDefault(it => it.Id == orderId);
            if (order == null)
                return NoContent();

            string filePath = Path.Combine($@"OrderFiles\{document}", $"{document}_{order.Id}_{order.OrderDate.ToString("ddMMyyyyHHmmss")}.pdf");

            // Delete file if exists and set new path
            if (document == "Invoice")
            {
                DeleteFile(order.InvoiceLocation);
                order.InvoiceLocation = filePath;
            }
            else if (document == "Warranty")
            {
                DeleteFile(order.WarrantyLocation);
                order.WarrantyLocation = filePath;
            }

            // Save file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }

            // Update order
            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch
            {
                throw;
            }
        }

        [HttpGet]
        [Authorize]
        [Route("DownloadFile/{orderId}/{document}")]
        public ActionResult<FileStream> Downloadfile(int orderId, string document)
        {
            var order = _context.Order.FirstOrDefault(it => it.Id == orderId);

            string filePath = document == "Invoice" ? order.InvoiceLocation : order.WarrantyLocation;

            if (string.IsNullOrWhiteSpace(filePath))
                return NoContent();

            return new FileStream(filePath, FileMode.Open, FileAccess.Read);
        }

        private void DeleteFile(string path)
        {
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
        }
    }
}