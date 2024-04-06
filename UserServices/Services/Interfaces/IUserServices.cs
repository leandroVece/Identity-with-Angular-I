using System.Security.Claims;
using UserData.Models;
using UserManagerServices.Models;

namespace UserManagerServices.Services;

public interface IUserServices
{

    public Task<ApiResponse<CreateUserResponse>> CreateUserWithTokenAsyn(RegisterUser data);
    public Task<ApiResponse<List<string>>> AssingRoleToUserAsyn(ApplicationUser user, List<string> roles);
    public Task<ApiResponse<string>> GetOtpLoginByAsyn(ApplicationUser data, string password);
    public Task<ApiResponse<LoginResponse>> GetJWTTokenAsyn(ApplicationUser data);
    public Task<ApiResponse<LoginResponse>> RenewAccessTokenAsync(LoginResponse tokens);
    public Task<List<Claim>> AddClaimForUser(ApplicationUser user);

}