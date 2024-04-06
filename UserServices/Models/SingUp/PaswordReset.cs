using System.ComponentModel.DataAnnotations;

namespace UserManagerServices.Models;
public class PaswordReset
{
    public string Password { get; set; }
    public string ResetPasword { get; set; }
    public string Token { get; set; }
    public string Email { get; set; }

}