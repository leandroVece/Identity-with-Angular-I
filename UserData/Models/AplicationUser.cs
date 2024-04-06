using Microsoft.AspNetCore.Identity;

namespace UserData.Models;

public class ApplicationUser : IdentityUser
{
    public string? TokenRefresh { get; set; }
    public DateTime TokenRefreshExpiry { get; set; }
}