using backend.Dtos.User;
using backend.Enum;

namespace backend.Dtos.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime TokenExpiry { get; set; }
        public UserDto User { get; set; }
    }
}
