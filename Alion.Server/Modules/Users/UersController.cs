using Alion.Server.Modules.Auth.Dtos;
using Alion.Server.Modules.Users;
using Alion.Server.Modules.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alion.Server.Modules.Auth;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;

    public UsersController(UserManager<User> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(GetUserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound();
        }

        var response = new GetUserResponse(await _userManager.GetUserIdAsync(user) ?? throw new NotSupportedException("Users must have an Id."), await _userManager.GetEmailAsync(user) ?? throw new NotSupportedException("Users must have an email."), await _userManager.GetRolesAsync(user) ?? throw new NotSupportedException("Users must have a role."), await _userManager.IsEmailConfirmedAsync(user));

        return Ok(response);
    }

    [HttpGet("player")]
    [ProducesResponseType(typeof(GetCurrentPlayerResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentPlayer()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var hasVillages = await _context.Villages.AnyAsync(v => v.UserId == user.Id);

        var response = new GetCurrentPlayerResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.TribeId,
            hasVillages
        );

        return Ok(response);
    }
}
