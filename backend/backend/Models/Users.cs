using backend.Enum;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
	public class Users
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[StringLength(50)]
		public string UserName { get; set; }

		[Required]
		[EmailAddress]
		[StringLength(100)]
		public string Email { get; set; }

		[Required]
		public string PasswordHash { get; set; }

		public UserType Type { get; set; } = UserType.Partner;

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? DeletedAt { get; set; }

		public string? RefreshToken { get; set; }
		public DateTime? RefreshTokenExpiryTime { get; set; }
	}
}
