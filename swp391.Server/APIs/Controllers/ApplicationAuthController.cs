using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.Auth;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Text;

[Authorize]
[ApiController]
[Route("api/auth")]
public class ApplicationAuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IEmailSender _emailService;
    private readonly IAccountService _accountService;
    private readonly IAuthenticationService _authenticationService;

    public ApplicationAuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, IEmailSender emailService, IAccountService context, IAuthenticationService authenticationService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _emailService = emailService;
        _accountService = context;
        _authenticationService = authenticationService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AccountDTO registerAccount)
    {
        if (ModelState.IsValid)
        {
            var errors = await _authenticationService.ValidateUniqueFields(registerAccount);
            if (errors != null)
            {
                return BadRequest(new { message = errors });
            }
            var user = new ApplicationUser
            {
                UserName = registerAccount.UserName,
                Email = registerAccount.Email,
                AccountFullname = registerAccount.FullName,
            };

            try
            {
                var account = await _accountService.CreateAccount(registerAccount, false);
                var role = Helpers.GetRole(registerAccount.RoleId);
                var result = await _userManager.CreateAsync(user, registerAccount.Password);
                if (result.Succeeded)
                {
                    await _authenticationService.SendConfirmationEmail(user.Id, user.Email);
                    await _userManager.AddToRoleAsync(user, role);
                    return Ok(new { message = "User registered successfully" });
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex);
            }
        }

        return BadRequest(ModelState);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ResponseUserDTO>> Login([FromBody] LoginModel loginAccount)
    {
        if (ModelState.IsValid)
        {
            string username = loginAccount.Email_Username;
            ApplicationUser user = null;
            if (loginAccount.Email_Username.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(loginAccount.Email_Username);
                if (user == null)
                {
                    return BadRequest(new { message = "Email does not exists" });
                }
                if (!user.EmailConfirmed)
                {
                    return BadRequest(new { message = "Account is not confirmed" });
                }
                username = user.UserName;
            } else
            {
                user = await _userManager.FindByNameAsync(loginAccount.Email_Username);
            }
            await _userManager.UpdateSecurityStampAsync(user);
            var result = await _signInManager.PasswordSignInAsync(username, loginAccount.Password, loginAccount.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return Ok(new ResponseUserDTO
                {
                    id = (await _accountService.GetAccountByCondition(x => x.Username == username)).AccountId,
                    role = await _authenticationService.GetUserRole(user)
                });
            }
        }

        // If we got this far, something failed, redisplay form
        return BadRequest(new { message = "Incorrect password" });
    }

    [AllowAnonymous]
    [HttpPost("roles")]
    public async Task<string?> GetRole(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName);
        return await _authenticationService.GetUserRole(user);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> LogOut()
    {
        await _signInManager.SignOutAsync();
        return Ok("User logged off");
    }

    [AllowAnonymous]
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        byte[] base64EncodedBytes = Convert.FromBase64String(token);
        string code = Encoding.UTF8.GetString(base64EncodedBytes);
        var user = await _userManager.FindByIdAsync(userId);

        var result = await _userManager.ConfirmEmailAsync(user, code);
        if (result.Succeeded)
        {
            await _accountService.SetAccountIsDisabled(new RequestAccountDisable
            {
                username = user.UserName,
                IsDisabled = false
            });
        }
        return Ok();
    }
   

    [AllowAnonymous]
    [HttpPost("send-confirm-email")]
    public async Task<IActionResult> SendConfirmEmail([FromBody] ConfirmReqUser user)
    {
        await _authenticationService.SendConfirmationEmail(user.UserId, user.Email);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("send-reset-password-email")]
    public async Task<IActionResult> SendForgotPasswordEmail([FromBody] PasswordReqUser user)
    {
        try
        {
            var _user = await _userManager.FindByEmailAsync(user.Email);
            if (_user == null) return BadRequest(new { message = "Email does not exists" });
            if (!(await _userManager.IsEmailConfirmedAsync(_user)))
            {
                return BadRequest(new { message = "Account is not activated" });
            }
            await _authenticationService.SendForgotPasswordEmail(_user, user.Email);

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] RequestResetPassword entity)
    {
        var user = await _userManager.FindByIdAsync(entity.UserId);
        IdentityResult result;
        try
        {
            byte[] base64EncodedBytes = Convert.FromBase64String(entity.Token);
            string code = Encoding.UTF8.GetString(base64EncodedBytes);
            result = await _userManager.ResetPasswordAsync(user, code, entity.NewPassword);

            await _accountService.UpdateAccPassword(new AccountUpdatePassDTO 
            { 
                Email = user.Email, Password = entity.NewPassword 
            });
        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(_userManager.ErrorDescriber.InvalidToken());
        }

        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok();
    }
    [AllowAnonymous]
    [HttpGet("roles")]
    public async Task<IActionResult> SetRole([FromQuery] string userName, [FromQuery] string role)
    {
        try
        {
            var user = await _userManager.FindByNameAsync(userName);
            await _userManager.AddToRoleAsync(user, role);

        }
        catch (Exception e)
        {
            return BadRequest(e);
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("sign-in-google")]
    public async Task<ActionResult<ResponseUserDTO>> GoogleLogin([FromBody] GoogleLoginModel model)
    {
        try
        {
            var account = await _authenticationService.SignInGoogle(model);
            return account;
        } catch (BadHttpRequestException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
