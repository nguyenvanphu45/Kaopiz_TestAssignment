using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
	public class LoginRequest
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		[StringLength(100, MinimumLength = 6)]
		public string Password { get; set; }

		public bool RememberMe { get; set; } = false;
	}
}
