using System.ComponentModel.DataAnnotations;

namespace UserManagerServices.Models;
public class RegisterUser
{
    public string UserName { get; set; }
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    public List<string>? Roles { get; set; }
}