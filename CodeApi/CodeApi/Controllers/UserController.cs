using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CodeApi.Data;
using CodeApi.Entities;
using CodeApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CodeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        public UserController(DatabaseContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        [Route("Register")]
        [Authorize(Roles = "Admin")]
        public async Task<object> Register(UserModel model)
        {
            var user = new ApplicationUser
            {
                FirstName = model.UserInfo.FirstName,
                Surname = model.UserInfo.Surname,
                UserName = model.UserInfo.UserName,
                Email = model.UserInfo.Email
            };

            try
            {
                // Create user and add role
                var result = await _userManager.CreateAsync(user, model.UserInfo.Password);
                await _userManager.AddToRoleAsync(user, model.UserInfo.Role);

                // Create company for new user
                var company = new Company
                {
                    UserId = user.Id,
                    Name = model.CompanyInfo.CompanyName,
                    Address = model.CompanyInfo.Address,
                    City = model.CompanyInfo.City,
                    PostalNumber = model.CompanyInfo.PostalNumber,
                    Oib = model.CompanyInfo.Oib
                };
                _context.Company.Add(company);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            // Check if user exists by given username
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var key = Encoding.UTF8.GetBytes("jQoE93Z5RvDo3qAY");
                var role = await _userManager.GetRolesAsync(user); // Get user roles
                IdentityOptions identityOptions = new IdentityOptions();

                // User authentication
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[] // Claims assoiciated with user
                    {
                        new Claim("UserID", user.Id.ToString()),
                        new Claim(identityOptions.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1), // Token expiration time
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) // Contains secret key and algorithm that we want to use for encryption
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor); // Generate token
                var token = tokenHandler.WriteToken(securityToken); // Write token
                return Ok(new { token, username = user.UserName }); // Return token
            }
            else
                return BadRequest(new { message = "User or password is incorrect." });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<ApplicationUser>> GetUsers()
        {
            return await _context.ApplicationUsers.ToListAsync();
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "Admin, B2B Partner")]
        public async Task<ActionResult<ApplicationUser>> GetUserAsync(string userId)
        {
            var user = _context.ApplicationUsers.FirstOrDefault(it => it.Id == userId);

            if (user == null)
                return NotFound();

            var roleName = await _userManager.GetRolesAsync(user);
            var userRole = _roleManager.Roles.FirstOrDefault(it => it.Name == roleName[0]);

            return Ok(user);
        }

        // GET: api/User/Roles
        [HttpGet]
        [Route("Roles")]
        public IEnumerable<IdentityRole> UserRoles()
        {
            return _roleManager.Roles.ToList();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("UserRole/{userId}")]
        public async Task<object> GetUserRole(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var roleName = await _userManager.GetRolesAsync(user);
            var userRole = _roleManager.Roles.FirstOrDefault(it => it.Name == roleName[0]);
            return new { userRole.Id, userRole.Name };
        }

        [HttpPut("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(string userId, UserModel model)
        {
            var user = _context.ApplicationUsers.FirstOrDefault(it => it.Id == userId);
            var company = _context.Company.FirstOrDefault(it => it.UserId == userId);

            if (user == null || company == null)
                return NoContent();

            // User
            user.FirstName = model.UserInfo.FirstName;
            user.Surname = model.UserInfo.Surname;
            user.UserName = model.UserInfo.UserName;
            user.NormalizedUserName = model.UserInfo.UserName;
            user.Email = model.UserInfo.Email;
            user.NormalizedEmail = model.UserInfo.Email;

            // Company
            company.Name = model.CompanyInfo.CompanyName;
            company.Oib = model.CompanyInfo.Oib;
            company.Address = model.CompanyInfo.Address;
            company.PostalNumber = model.CompanyInfo.PostalNumber;
            company.City = model.CompanyInfo.City;

            _context.Entry(user).State = EntityState.Modified;
            _context.Entry(company).State = EntityState.Modified;

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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NoContent();

            try
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    // Remove roles from user
                    await _userManager.RemoveFromRoleAsync(user, role);
                }

                // Delete user's company
                var company = _context.Company.FirstOrDefault(it => it.UserId == user.Id);
                _context.Company.Remove(company);

                // Delete user
                await _userManager.DeleteAsync(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}