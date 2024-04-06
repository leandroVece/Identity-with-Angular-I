namespace UserManagerServices.Models;

public class LoginResponse
{
    public TokenType TokenAcces { get; set; }
    public TokenType TokenRefresh { get; set; }

}