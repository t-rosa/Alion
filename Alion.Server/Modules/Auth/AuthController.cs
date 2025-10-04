using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Alion.Server.Modules.Auth.Dtos;
using Alion.Server.Modules.Users;

namespace Alion.Server.Modules.Auth;

[Authorize]
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IEmailSender<User> _emailSender;

    private static readonly EmailAddressAttribute _emailAddressAttribute = new();

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IEmailSender<User> emailSender)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registration)
    {
        if (string.IsNullOrEmpty(registration.Email) || !_emailAddressAttribute.IsValid(registration.Email))
            return ValidationProblem();

        var user = new User();
        await _userManager.SetUserNameAsync(user, registration.Email);
        await _userManager.SetEmailAsync(user, registration.Email);

        var result = await _userManager.CreateAsync(user, registration.Password);
        if (!result.Succeeded) return ValidationProblem();

        if (!await _userManager.IsInRoleAsync(user, "User"))
        {
            await _userManager.AddToRoleAsync(user, "User");
        }

        await SendConfirmationEmailAsync(user, registration.Email);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Login([FromBody] LoginRequest login, [FromQuery] bool? useCookies, [FromQuery] bool? useSessionCookies)
    {
        var useCookieScheme = (useCookies == true) || (useSessionCookies == true);
        var isPersistent = (useCookies == true) && (useSessionCookies != true);
        _signInManager.AuthenticationScheme = useCookieScheme
            ? IdentityConstants.ApplicationScheme
            : IdentityConstants.BearerScheme;

        var result = await _signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent, lockoutOnFailure: true);

        if (result.RequiresTwoFactor)
        {
            if (!string.IsNullOrEmpty(login.TwoFactorCode))
            {
                result = await _signInManager.TwoFactorAuthenticatorSignInAsync(login.TwoFactorCode, isPersistent, isPersistent);
            }
            else if (!string.IsNullOrEmpty(login.TwoFactorRecoveryCode))
            {
                result = await _signInManager.TwoFactorRecoveryCodeSignInAsync(login.TwoFactorRecoveryCode);
            }
        }

        if (!result.Succeeded) return Unauthorized(result.ToString());
        return NoContent();
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("confirmEmail")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string code, [FromQuery] string? changedEmail)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        try { code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)); }
        catch (FormatException) { return Unauthorized(); }

        IdentityResult result;
        if (string.IsNullOrEmpty(changedEmail))
            result = await _userManager.ConfirmEmailAsync(user, code);
        else
        {
            result = await _userManager.ChangeEmailAsync(user, changedEmail, code);
            if (result.Succeeded) result = await _userManager.SetUserNameAsync(user, changedEmail);
        }

        if (!result.Succeeded) return Unauthorized();
        return Redirect("/");
    }

    [AllowAnonymous]
    [HttpPost("resendConfirmationEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailRequest resendRequest)
    {
        var user = await _userManager.FindByEmailAsync(resendRequest.Email);
        if (user == null) return Ok();

        await SendConfirmationEmailAsync(user, resendRequest.Email);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("forgotPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest resetRequest)
    {
        var user = await _userManager.FindByEmailAsync(resetRequest.Email);
        if (user != null && await _userManager.IsEmailConfirmedAsync(user))
        {
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            await _emailSender.SendPasswordResetCodeAsync(user, resetRequest.Email, HtmlEncoder.Default.Encode(code));
        }
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("resetPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest resetRequest)
    {
        var user = await _userManager.FindByEmailAsync(resetRequest.Email);
        if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
            return ValidationProblem();

        IdentityResult result;
        try
        {
            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetRequest.ResetCode));
            result = await _userManager.ResetPasswordAsync(user, code, resetRequest.NewPassword);
        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(_userManager.ErrorDescriber.InvalidToken());
        }

        if (!result.Succeeded) return ValidationProblem();
        return Ok();
    }

    [HttpPost("info")]
    [ProducesResponseType(typeof(GetUserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateInfo([FromBody] UpdateUserRequest infoRequest)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();

        if (!string.IsNullOrEmpty(infoRequest.NewEmail) && !_emailAddressAttribute.IsValid(infoRequest.NewEmail))
            return ValidationProblem();

        if (!string.IsNullOrEmpty(infoRequest.NewPassword))
        {
            if (string.IsNullOrEmpty(infoRequest.OldPassword))
                return ValidationProblem();

            var pwdResult = await _userManager.ChangePasswordAsync(user, infoRequest.OldPassword, infoRequest.NewPassword);
            if (!pwdResult.Succeeded) return ValidationProblem();
        }

        if (!string.IsNullOrEmpty(infoRequest.NewEmail))
        {
            var current = await _userManager.GetEmailAsync(user);
            if (current != infoRequest.NewEmail)
                await SendConfirmationEmailAsync(user, infoRequest.NewEmail, isChange: true);
        }

        var response = new GetUserResponse(await _userManager.GetUserIdAsync(user) ?? throw new NotSupportedException("Users must have an Id."), await _userManager.GetEmailAsync(user) ?? throw new NotSupportedException("Users must have an email."), await _userManager.GetRolesAsync(user) ?? throw new NotSupportedException("Users must have a role."), await _userManager.IsEmailConfirmedAsync(user));

        return Ok(response);
    }

    private async Task SendConfirmationEmailAsync(User user, string email, bool isChange = false)
    {
        var code = isChange
            ? await _userManager.GenerateChangeEmailTokenAsync(user, email)
            : await _userManager.GenerateEmailConfirmationTokenAsync(user);

        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var userId = await _userManager.GetUserIdAsync(user);

        var url = Url.Action(nameof(ConfirmEmail), "Users", new { userId, code, changedEmail = isChange ? email : null }, Request.Scheme)!;
        await _emailSender.SendConfirmationLinkAsync(user, email, HtmlEncoder.Default.Encode(url));
    }
}
