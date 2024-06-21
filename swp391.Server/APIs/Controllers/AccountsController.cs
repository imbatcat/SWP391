using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Services.Interfaces;
using PetHealthcare.Server.Helpers;
using System.Security.Policy;
using NanoidDotNet;
using PetHealthcare.Server.Services;
using PetHealthcare.Server.Services.AuthInterfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Customer")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _context;
        private readonly IPetService _contextPet;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthenticationService _authService;

        public AccountsController(IAccountService context, IPetService contextPet, UserManager<ApplicationUser> userManager, IAuthenticationService authService)
        {
            _context = context;
            _contextPet = contextPet;
            _userManager = userManager;
            _authService = authService;
        }

        // GET: api/Accounts
        //<summary>
        //get all of the account
        //</summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Account>))]
        public async Task<IEnumerable<Account>> GetAccounts()
        {
            return await _context.GetAllAccounts();
        }

        //get all account with the same role
        [HttpGet("/api/byRole/{roleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<Account>> GetAllAccountsByRole([FromRoute] int roleId)
        {
            return await _context.GetAllAccountsByRole(roleId);
        }
        //get a single account with specific role and id
        [HttpGet("/api/byRole/{roleId}&{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Account>> GetAccountByRole([FromRoute] string roleId, [FromRoute] string id)
        {
            var checkAccount = await _context.GetAccountByCondition(a => a.AccountId == id);
            if (checkAccount == null)
            {
                return NotFound();
            }
            return Ok(checkAccount);
        }
        // GET: get the account with the input id
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount([FromRoute] string id)
        {
            var account = await _context.GetAccountByCondition(a => a.AccountId == id);

            if (account == null)
            {
                return NotFound(new { message = "No such account exists, check your id" });
            }

            return account;
        }

        // change the information of the account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(string id, AccountDTO account)
        {
            await _context.UpdateAccount(id, account);

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!AccountExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return NoContent();
        }

        // POST: create a new user and insert it into database
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Account>> PostAccount([FromBody] AccountDTO accountDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Bad input");
            }
            try
            {
                var password = "a1Z." + Nanoid.Generate(size: 6);
                accountDTO.Password = password;
                var result = await _context.CreateAccount(accountDTO, true);
                var role = Helpers.Helpers.GetRole(accountDTO.RoleId);
                var appUser = new ApplicationUser
                {
                    Email = accountDTO.Email,
                    EmailConfirmed = true,
                    AccountFullname = accountDTO.FullName,
                    PhoneNumber = accountDTO.PhoneNumber,
                    UserName = accountDTO.UserName
                };

                var results = await _userManager.CreateAsync(appUser, password);
                if (results.Succeeded)
                {
                    await _authService.SendAccountEmail(accountDTO.Email, password, accountDTO.UserName);
                    await _userManager.AddToRoleAsync(appUser, role);
                    return CreatedAtAction(
                             "GetAccount", new { id = accountDTO.GetHashCode() }, accountDTO);
                }
                foreach (var error in results.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex);
            }
            return BadRequest(ModelState);

        }

        // DELETE: change the status of the account to true, not show it to the customer
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(string id)
        {
            var account = await _context.GetAccountByCondition(a => a.AccountId == id);
            if (account == null)
            {
                return NotFound();
            }

            await _context.DeleteAccount(account);

            return NoContent();
        }
    }
}
