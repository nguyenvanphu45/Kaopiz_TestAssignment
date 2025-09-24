using backend.Data;
using backend.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend.Extensions
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection AddAuthModule(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("Default"))
				.EnableSensitiveDataLogging()
				.EnableDetailedErrors());

			services.AddAuthentication("JwtBearer")
				.AddJwtBearer("JwtBearer", options =>
				{
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateLifetime = true,
						ValidateIssuerSigningKey = true,
						ValidIssuer = configuration["Jwt:Issuer"],
						ValidAudience = configuration["Jwt:Audience"],
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
						ClockSkew = TimeSpan.Zero
					};
				});

			services.AddScoped<IAuthService, AuthService>();

			return services;
		}
	}
}
