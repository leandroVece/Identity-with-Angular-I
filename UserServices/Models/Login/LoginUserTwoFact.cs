using System.ComponentModel.DataAnnotations;

namespace UserManagerServices.Models;
public class LoginUserTwoFactoery
{
    [Required]
    public string email { get; set; }
    public bool TowFactory { get; set; }
}