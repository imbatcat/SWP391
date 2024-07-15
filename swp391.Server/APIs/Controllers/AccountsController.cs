using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Net.Http.Headers;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/account-management")]
    [Authorize(Roles = "Admin, Customer, Vet")]
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
        [HttpGet("accounts")]
        [Authorize(Roles = "Admin, Vet")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Account>))]
        public async Task<IEnumerable<Account>> GetAccounts()
        {
            return await _context.GetAllAccounts();
        }

        //get all account with the same role
        [HttpGet("roles/{roleId}/accounts")]
        [Authorize(Roles = "Admin, Customer, Vet")]
        public async Task<IEnumerable<Account>> GetAllAccountsByRole([FromRoute] int roleId)
        {
            return await _context.GetAllAccountsByRole(roleId);
        }
        //get a single account with specific role and id
        [HttpGet("roles/{roleId}/accounts/{id}")]
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
        [Authorize(Roles = "Vet, Customer")]
        [HttpGet("accounts/{id}")]
        public async Task<ActionResult<Account>> GetAccount([FromRoute] string id)
        {
            var account = await _context.GetAccountByCondition(a => a.AccountId == id);

            if (account == null)
            {
                return NotFound(new { message = "No such account exists, check your id" });
            }

            return account;
        }

        [HttpGet("date/{date}/time-slot/{timeslotId}/choose-vet")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<IEnumerable<VetListDTO>> chooseVet([FromRoute] DateOnly date, [FromRoute] int timeslotId)
        {
            return await _context.GetVetListToChoose(date, timeslotId);
        }

        // change the information of the account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("accounts/{id}")]
        public async Task<IActionResult> PutAccount([FromRoute]string id, AccountUpdateDTO account)
        {
            await _context.UpdateAccount(id, account);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("accounts/unlock-account/{accountId}")]
        public async Task<ActionResult<Account>> UnlockAccount([FromRoute] string accountId)
        {
            await _context.UnlockAccount(accountId);
            return Ok(); 
        }
        // POST: create a new user and insert it into database
        [Authorize(Roles = "Admin")]
        [HttpPost("accounts")]
        public async Task<ActionResult<Account>> PostAccount([FromBody] InternalAccountDTO internalAccountDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Bad input");
            }
            try
            {
                var password = "a1Z." + Nanoid.Generate(size: 6);
                await _context.CreateInternalUser(internalAccountDTO, password);
                var role = Helpers.GetRole(internalAccountDTO.RoleId);
                var appUser = new ApplicationUser
                {
                    Email = internalAccountDTO.Email,
                    EmailConfirmed = true,
                    AccountFullname = internalAccountDTO.FullName,
                    PhoneNumber = internalAccountDTO.PhoneNumber,
                    UserName = internalAccountDTO.UserName
                };

                var results = await _userManager.CreateAsync(appUser, password);
                if (results.Succeeded)
                {
                    await _authService.SendAccountEmail(internalAccountDTO.Email, password, internalAccountDTO.UserName);
                    await _userManager.AddToRoleAsync(appUser, role);
                    return CreatedAtAction(
                             "GetAccount", new { id = internalAccountDTO.GetHashCode() }, internalAccountDTO);
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
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return BadRequest(ModelState);

        }

        // DELETE: change the status of the account to true, not show it to the customer
        [HttpDelete("accounts/{id}")]
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

        [HttpPost("img-upload")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<IActionResult> UploadImgUrl(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return NotFound("No file uploaded.");
            }

            using var client = new HttpClient();
            var content = new MultipartFormDataContent();

            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
            {
                Name = "file",
                FileName = file.FileName
            };
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            content.Add(fileContent);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://api.cloudflare.com/client/v4/accounts/{JsonReader.readJson("Cloudflare:account-id")}/images/v1"),
                Headers =
                {
                    { "Authorization", $"Bearer {JsonReader.readJson("Cloudflare:api-token")}" },
                },
                Content = content
            };

            // Debugging: Print out the request content
            var debugContent = await content.ReadAsStringAsync();
            Console.WriteLine("Request Content: " + debugContent);

            using var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Error Response: " + errorBody);
                return StatusCode((int)response.StatusCode, errorBody);
            }

            var body = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Response Body: " + body);
            return Ok(body);
        }
    }
}
