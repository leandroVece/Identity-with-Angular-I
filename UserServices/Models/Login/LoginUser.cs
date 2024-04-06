using System.ComponentModel.DataAnnotations;

namespace UserManagerServices.Models;
public class LoginUser
{
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Password { get; set; }
}