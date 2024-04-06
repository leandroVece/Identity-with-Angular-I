using Login.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserData.Models;
using UserManagerServices.Models;

namespace Login.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ILogger<AdminController> _logger;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(ILogger<AdminController> logger, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }


    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> GetRoles()
    {
        // Obtener todos los roles
        var roles = await _roleManager.Roles.ToListAsync();

        // Puedes devolver la lista de roles directamente o adaptarla según tus necesidades
        return Ok(roles);
    }

    [HttpPost("settings")]
    public async Task<IActionResult> TowFactory([FromBody] LoginUserTwoFactoery data)
    {

        //check User Exist
        var UserExist = await _userManager.FindByEmailAsync(data.email);

        if (UserExist != null)
        {
            UserExist.TwoFactorEnabled = data.TowFactory;

            var result = await _userManager.UpdateAsync(UserExist);
            if (result.Succeeded)
            {
                return StatusCode(StatusCodes.Status200OK,
                new Response { Status = "Success", Message = "Cambios guardados correctamente" });
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                new Response { Status = "Error", Message = "Error al guardar cambios" });
            }
        }
        return Unauthorized();
    }

}