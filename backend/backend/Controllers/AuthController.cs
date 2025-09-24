using Azure;
using backend.Dtos;
using backend.Dtos.Auth;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
	[Route("api/[controller]")]
	public class AuthController: ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<ServiceResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
		{
			var response = await _authService.RegisterAsync(request);
			if (response.Status != 200)
			{
				return StatusCode(response.Status, response);
			}
			return Ok(response);
		}

		[HttpPost("login")]
		public async Task<ActionResult<ServiceResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
		{
			var response = await _authService.LoginAsync(request);
			if (response.Status != 200)
			{
				return StatusCode(response.Status, response);
			}
			return Ok(response);
		}

		[HttpPost("refresh")]
		public async Task<IActionResult> Refresh([FromBody] string refreshToken)
		{
			var response = await _authService.RefreshTokenAsync(refreshToken);
			if (response.Status != 200)
			{
				return StatusCode(response.Status, response);
			}
			return Ok(response);
		}

		[HttpPost("logout")]
		public async Task<IActionResult> Logout([FromBody] string refreshToken)
		{
			var result = await _authService.LogoutAsync(refreshToken);
			return StatusCode(result.Status, result);
		}
	}
}
