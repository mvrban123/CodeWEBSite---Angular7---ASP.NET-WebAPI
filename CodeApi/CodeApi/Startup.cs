using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeApi.Data;
using CodeApi.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;

namespace CodeApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = null });


            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(Configuration.GetConnectionString(nameof(DatabaseContext))));

            services.AddDefaultIdentity<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DatabaseContext>();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            });

            // Encoded secret key - it should at least contain 16 characters
            var key = Encoding.UTF8.GetBytes(Configuration["ApplicationSettings:JWT_Secret"].ToString());

            // JWT Authentication
            services.AddAuthentication(it =>
            {
                // Configure schemes
                it.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                it.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                it.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(it =>
            { // Configure JWT token itself
                it.RequireHttpsMetadata = false; // Restricts authentication resources to only HTTPS
                it.SaveToken = false; // Determines if we want to save token to server
                it.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters // Validation of the token after successful validation
                {
                    ValidateIssuerSigningKey = true, // System will validate security key during token validation
                    IssuerSigningKey = new SymmetricSecurityKey(key), // Secret part of JWT
                    ValidateIssuer = false, // Who generated token
                    ValidateAudience = false, // Targeted audience of the token - we don’t have to validate those properties
                    ClockSkew = TimeSpan.Zero // There is no time zone difference between server and client side so it's set to zero
                };
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //string origin = "http://localhost:4200";
            string origin = "http://code-it.hr";

            app.UseCors(options => options.WithOrigins(origin)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials());

            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
