using backend.Enum;

namespace backend.Dtos.User
{
	public class UserDto
	{
		public int Id { get; set; }
		public string UserName { get; set; }
		public string Email { get; set; }
		public UserType Type { get; set; }
	}
}
