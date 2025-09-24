using backend.Enum;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
	public class RegisterRequest
	{
		[Required]
		[StringLength(50)]
		public string UserName { get; set; }

		[Required]
		[EmailAddress]
		[StringLength(100)]
		public string Email { get; set; }

		[Required]
		[StringLength(100, MinimumLength = 6)]
		public string Password { get; set; }

		public UserType? UserType { get; set; } = Enum.UserType.EndUser;
	}
}
