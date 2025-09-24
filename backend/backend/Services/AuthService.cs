using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using backend.Data;
using backend.Dtos.Auth;
using backend.Enum;
using backend.Interfaces;
using backend.Models;
using backend.Dtos;
using backend.Dtos.User;

namespace backend.Services
{
    public class AuthService: IAuthService
	{
		private readonly AppDbContext _db;
		private readonly IConfiguration _config;
		private readonly ILogger<AuthService> _logger;

		public AuthService(AppDbContext db, IConfiguration config, ILogger<AuthService> logger)
		{
			_db = db;
			_config = config;
			_logger = logger;
		}

		public async Task<ServiceResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
		{
			try
			{
				if (await _db.Users.AnyAsync(u => u.Email == request.Email))
					return new ServiceResponse<AuthResponse> { Message = "Email already exists", Status = 400 };

				var user = new Users
				{
					UserName = request.UserName,
					Email = request.Email,
					Type = request.UserType ?? UserType.Partner,
					PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
				};

				_db.Users.Add(user);
				await _db.SaveChangesAsync();

				var authResponse = await GenerateAuthResponse(user);
				return new ServiceResponse<AuthResponse> { 
					Data = authResponse, 
					Message = "Register successful", 
					Status = 200 
				};
			}
			catch (Exception ex) 
			{
				_logger.LogError(ex, "Error during RegisterAsync");
				return new ServiceResponse<AuthResponse> { 
					Message = "An error occurred during registration.", 
					Status = 500 
				};
			}
		}

		public async Task<ServiceResponse<AuthResponse>> LoginAsync(LoginRequest request)
		{
			try
			{
				var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

				if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
					return new ServiceResponse<AuthResponse> { Message = "Invalid credentials", Status = 401 };

				var authResponse = await GenerateAuthResponse(user, request.RememberMe);

				return new ServiceResponse<AuthResponse> 
				{ 
					Data = authResponse, 
					Message = "Login successful", 
					Status = 200 
				};
			}
			catch (Exception ex) 
			{
				_logger.LogError(ex, "Error during LoginAsync");
				return new ServiceResponse<AuthResponse>
				{
					Data = null,
					Message = "An error occurred during login.",
					Status = 500
				};
			}
		}

		public async Task<ServiceResponse<AuthResponse>> RefreshTokenAsync(string refreshToken)
		{
			try
			{
				var user = await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

				if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
					return new ServiceResponse<AuthResponse> { 
						Message = "Invalid or expired refresh token", 
						Status = 401 
					};

				var authResponse = await GenerateAuthResponse(user);

				return new ServiceResponse<AuthResponse> { 
					Data = authResponse, 
					Message = "Token refreshed", 
					Status = 200 
				};
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error during RefreshTokenAsync");
				return new ServiceResponse<AuthResponse> { 
					Message = "An error occurred during token refresh.", 
					Status = 500 
				};
			}
		}

		public async Task<ServiceResponse<bool>> LogoutAsync(string refreshToken)
		{
			try
			{
				var user = await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

				if (user == null)
					return new ServiceResponse<bool> { Data = false, Message = "Invalid token", Status = 400 };

				user.RefreshToken = null;
				user.RefreshTokenExpiryTime = null;
				await _db.SaveChangesAsync();

				return new ServiceResponse<bool> { 
					Data = true, 
					Message = "Logout successful", 
					Status = 200 
				};
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error during LogoutAsync");
				return new ServiceResponse<bool> { 
					Data = false, 
					Message = "An error occurred during logout.", 
					Status = 500 
				};
			}
		}

		private async Task<AuthResponse> GenerateAuthResponse(Users user, bool rememberMe = false)
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
			var tokenExpiry = DateTime.UtcNow.AddHours(1);

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
					new Claim("id", user.Id.ToString()),
					new Claim(ClaimTypes.Email, user.Email),
					new Claim(ClaimTypes.Role, user.Type.ToString()),
					new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
				}),
				Expires = tokenExpiry,
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			var jwtToken = tokenHandler.WriteToken(token);

			// Generate refresh token
			var refreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(rememberMe ? 30 : 7);
			await _db.SaveChangesAsync();

			return new AuthResponse
			{
				Token = jwtToken,
				RefreshToken = refreshToken,
				TokenExpiry = tokenExpiry,
				User = new UserDto
				{
					Id = user.Id,
					UserName = user.UserName,
					Email = user.Email,
					Type = user.Type
				}
			};
		}
	}
}
