using System.ComponentModel.DataAnnotations;
using UserData.Models;


namespace UserManagerServices.Models;

public class CreateUserResponse
{
    public string Token { get; set; }
    public ApplicationUser User { get; set; }
}