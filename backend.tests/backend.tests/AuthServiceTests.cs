using System;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using backend.Data;
using backend.Services;
using backend.Dtos.Auth;
using backend.Models;
using BCrypt.Net;

namespace backend.tests
{
	public class AuthServiceTests
	{
		private readonly IConfiguration _config;

		public AuthServiceTests()
		{
			var inMemorySettings = new Dictionary<string, string> {
				{"Jwt:Key", "ThisIsASecretKeyForJwtAuth1234567890!!"},
				{"Jwt:Issuer", "MyApp"},
				{"Jwt:Audience", "MyAppUsers"}
			};

			_config = new ConfigurationBuilder()
				.AddInMemoryCollection(inMemorySettings)
				.Build();
		}

		private AppDbContext GetDbContext()
		{
			var options = new DbContextOptionsBuilder<AppDbContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.Options;

			return new AppDbContext(options);
		}

		// RegisterAsync
		[Fact]
		public async Task RegisterAsync_Should_Create_New_User_Success()
		{
			var db = GetDbContext();
			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var request = new RegisterRequest
			{
				UserName = "testuser",
				Email = "test@example.com",
				Password = "Password123"
			};

			var response = await service.RegisterAsync(request);

			Assert.Equal(200, response.Status);
			Assert.NotNull(response.Data);
			Assert.Equal("test@example.com", response.Data.User.Email);
		}

		[Fact]
		public async Task RegisterAsync_Should_Fail_When_Email_Already_Exists()
		{
			var db = GetDbContext();
			db.Users.Add(new Users { UserName = "test", Email = "test@example.com", PasswordHash = "hash" });
			db.SaveChanges();

			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var request = new RegisterRequest
			{
				UserName = "test2",
				Email = "test@example.com",
				Password = "Password123"
			};

			var result = await service.RegisterAsync(request);

			Assert.Equal(400, result.Status);
			Assert.Null(result.Data);
		}

		// LoginAsync
		[Fact]
		public async Task LoginAsync_Should_Return_Token_When_Credentials_Are_Valid()
		{
			var db = GetDbContext();
			var hashedPassword = BCrypt.Net.BCrypt.HashPassword("Password123");

			db.Users.Add(new Users
			{
				UserName = "testuser",
				Email = "test@example.com",
				PasswordHash = hashedPassword
			});
			db.SaveChanges();

			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var request = new LoginRequest
			{
				Email = "test@example.com",
				Password = "Password123"
			};

			var result = await service.LoginAsync(request);

			Assert.Equal(200, result.Status);
			Assert.NotNull(result.Data.Token);
			Assert.NotNull(result.Data.RefreshToken);
		}

		[Fact]
		public async Task LoginAsync_Should_Fail_When_Invalid_Password()
		{
			var db = GetDbContext();
			var hashedPassword = BCrypt.Net.BCrypt.HashPassword("Password123");

			db.Users.Add(new Users
			{
				UserName = "testuser",
				Email = "test@example.com",
				PasswordHash = hashedPassword
			});
			db.SaveChanges();

			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var request = new LoginRequest
			{
				Email = "test@example.com",
				Password = "WrongPassword"
			};

			var result = await service.LoginAsync(request);

			Assert.Equal(401, result.Status);
			Assert.Null(result.Data);
		}

		[Fact]
		public async Task LoginAsync_Should_Fail_When_Email_Not_Found()
		{
			var db = GetDbContext();
			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var request = new LoginRequest
			{
				Email = "notfound@example.com",
				Password = "Password123"
			};

			var result = await service.LoginAsync(request);

			Assert.Equal(401, result.Status);
			Assert.Null(result.Data);
		}

		// RefreshTokenAsync
		[Fact]
		public async Task RefreshTokenAsync_Should_Return_New_Token_When_Valid()
		{
			var db = GetDbContext();
			var hashedPassword = BCrypt.Net.BCrypt.HashPassword("Password123");

			var user = new Users
			{
				UserName = "testuser",
				Email = "test@example.com",
				PasswordHash = hashedPassword
			};

			db.Users.Add(user);
			db.SaveChanges();

			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var login = await service.LoginAsync(new LoginRequest
			{
				Email = "test@example.com",
				Password = "Password123"
			});

			var oldToken = login.Data.Token;
			var refreshToken = login.Data.RefreshToken;

			var result = await service.RefreshTokenAsync(refreshToken);

			Assert.Equal(200, result.Status);
			Assert.NotNull(result.Data.Token);
			Assert.NotEqual(oldToken, result.Data.Token);
		}

		[Fact]
		public async Task RefreshTokenAsync_Should_Fail_When_Invalid_Token()
		{
			var db = GetDbContext();
			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var result = await service.RefreshTokenAsync("fake-refresh-token");

			Assert.Equal(401, result.Status);
			Assert.Null(result.Data);
		}

		[Fact]
		public async Task RefreshTokenAsync_Should_Fail_When_RefreshToken_Not_Match()
		{
			var db = GetDbContext();
			var hashedPassword = BCrypt.Net.BCrypt.HashPassword("Password123");

			var user = new Users
			{
				UserName = "testuser",
				Email = "test@example.com",
				PasswordHash = hashedPassword,
				RefreshToken = "some-old-refresh-token"
			};

			db.Users.Add(user);
			db.SaveChanges();

			var service = new AuthService(db, _config, NullLogger<AuthService>.Instance);

			var result = await service.RefreshTokenAsync("wrong-refresh-token");

			Assert.Equal(401, result.Status);
			Assert.Null(result.Data);
		}
	}
}
