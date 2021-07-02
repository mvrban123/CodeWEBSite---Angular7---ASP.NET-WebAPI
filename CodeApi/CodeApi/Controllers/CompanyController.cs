using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeApi.Data;
using CodeApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public CompanyController(DatabaseContext context)
        {
            _context = context;
        }

        // POST: api/Company
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            try
            {
                _context.Company.Add(company);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        // GET: api/Company/userId
        [HttpGet("{userId}")]
        [Authorize]
        public ActionResult<Company> GetUserCompany(string userId)
        {
            var company = _context.Company.Include(it => it.User).FirstOrDefault(it => it.UserId == userId);

            if (company == null)
                return NotFound();

            return company;
        }
    }
}