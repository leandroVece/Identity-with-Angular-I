using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using UserData.Models;
using UserManagerServices.Models;


namespace UserManagerServices.Services;

public class UserServices : IUserServices
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public UserServices(
        UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
        SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<List<Claim>> AddClaimForUser(ApplicationUser user)
    {
        var authClaims = new List<Claim>{
                new Claim(ClaimTypes.Name,user.UserName!),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

        //We add roles to the list
        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var role in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        return authClaims;
    }

    public async Task<ApiResponse<List<string>>> AssingRoleToUserAsyn(ApplicationUser user, List<string> roles)
    {
        var AssingRoles = new List<string>();
        foreach (var item in roles)
        {
            if (await _roleManager.RoleExistsAsync(item) && !await _userManager.IsInRoleAsync(user, item))
            {
                await _userManager.AddToRoleAsync(user, item);
                AssingRoles.Add(item);
            }
        }
        return new ApiResponse<List<string>> { IsSuccess = true, StatusCode = 200, Message = "Roles asignados correctamente", Response = AssingRoles };
    }

    public async Task<ApiResponse<CreateUserResponse>> CreateUserWithTokenAsyn(RegisterUser data)
    {
        //check User Exist
        var UserExist = await _userManager.FindByEmailAsync(data.Email);
        if (UserExist != null)
        {
            return new ApiResponse<CreateUserResponse> { IsSuccess = false, StatusCode = 403, Message = "Usuario ya existe" };
        }

        //Add the User en the DB
        ApplicationUser user = new ApplicationUser()
        {
            Email = data.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = data.UserName
        };

        try
        {
            var result = await _userManager.CreateAsync(user, data.Password);
            if (result.Succeeded)
            {
                // //Add token verify the email

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                return new ApiResponse<CreateUserResponse>
                {
                    IsSuccess = true,
                    StatusCode = 201,
                    Response = new CreateUserResponse { Token = token, User = user },
                    Message = "Usuario creado y correo de confirmacion enviado exitosamente"
                };
            }
            else
            {
                return new ApiResponse<CreateUserResponse>
                {
                    IsSuccess = false,
                    StatusCode = 500,
                    Message = "Error al crear el usuario: " + string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }
        }
        catch (System.Exception ex)
        {

            Console.Write("error" + ex);
            return null;
        }

    }
    public async Task<ApiResponse<string>> GetOtpLoginByAsyn(ApplicationUser data, string password)
    {
        //var UserExist = await _userManager.FindByNameAsync(data.UserName);
        await _signInManager.SignOutAsync();
        await _signInManager.PasswordSignInAsync(data.UserName, password, false, true);

        var token = await _userManager.GenerateTwoFactorTokenAsync(data, "Email");

        return new ApiResponse<string>
        {
            IsSuccess = true,
            StatusCode = 201,
            Response = token,
            Message = "Usuario creado y correo de confirmacion enviado exitosamente"
        };

    }

    public async Task<ApiResponse<LoginResponse>> GetJWTTokenAsyn(ApplicationUser data)
    {
        var authClaims = await AddClaimForUser(data);
        //Generate the thoken the claims
        if (data.TokenRefreshExpiry <= DateTime.Now)
        {
            updateTokenRefresh(data);
        }

        var jwt = GetToken(authClaims);
        return new ApiResponse<LoginResponse>
        {
            Response = new LoginResponse
            {
                TokenAcces = new()
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(jwt),
                    TimeExpiry = jwt.ValidTo
                },
                TokenRefresh = new()
                {
                    Token = data.TokenRefresh,
                    TimeExpiry = data.TokenRefreshExpiry
                }
            },
            IsSuccess = true,
            StatusCode = 200,
            Message = $"Token created"
        };
    }

    public async Task<ApiResponse<LoginResponse>> RenewAccessTokenAsync(LoginResponse tokens)
    {

        var accessToken = tokens.TokenAcces;
        var refreshToken = tokens.TokenRefresh;
        var principal = GetClaimsPrincipal(accessToken.Token);
        var user = await _userManager.FindByNameAsync(principal.Identity.Name);
        if (refreshToken.Token != user.TokenRefresh && refreshToken.TimeExpiry <= DateTime.Now)
        {
            return new ApiResponse<LoginResponse>
            {
                IsSuccess = false,
                StatusCode = 400,
                Message = $"Token invalid or expired"
            };
        }
        var response = await GetJWTTokenAsyn(user);
        return response;
    }

    #region 
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSingingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
        var Expiry = int.Parse(_configuration["JWT:ExpityTokenInMinutes"]);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddMinutes(Expiry),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSingingKey, SecurityAlgorithms.HmacSha256)
        );
        return token;
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new Byte[64];
        using (var range = RandomNumberGenerator.Create())
        {
            range.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    private void updateTokenRefresh(ApplicationUser user)
    {
        user.TokenRefresh = GenerateRefreshToken();
        var daysExpiry = int.Parse(_configuration["JWT:TokenRefreshInDays"]);
        user.TokenRefreshExpiry = DateTime.Now.AddDays(daysExpiry);

        _userManager.UpdateAsync(user);
    }

    private ClaimsPrincipal GetClaimsPrincipal(string tokenaccess)
    {

        var TokenValidation = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
            ValidateLifetime = false
        };

        var tokenHandel = new JwtSecurityTokenHandler();
        var principal = tokenHandel.ValidateToken(tokenaccess, TokenValidation, out SecurityToken securityToken);

        return principal;
    }

    #endregion

}