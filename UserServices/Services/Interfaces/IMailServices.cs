using UserManagerServices.Models;

namespace UserManagerServices.Services;
public interface IEmailServices
{
    void SendMail(Message message);
}