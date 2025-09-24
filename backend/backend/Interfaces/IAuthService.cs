using backend.Dtos;
using backend.Dtos.Auth;
using backend.Dtos.User;

namespace backend.Interfaces
{
    public interface IAuthService
	{
		Task<ServiceResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
		Task<ServiceResponse<AuthResponse>> LoginAsync(LoginRequest request);
		Task<ServiceResponse<AuthResponse>> RefreshTokenAsync(string refreshToken);
		Task<ServiceResponse<bool>> LogoutAsync(string refreshToken);
	}
}
