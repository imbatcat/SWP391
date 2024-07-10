using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountService(IAccountRepository accountService, UserManager<ApplicationUser> userManager)
        {
            _accountService = accountService;
            _userManager = userManager;
        }

        public async Task<Account?> CreateAccount(AccountDTO Account, bool isGoogle)
        {
            var _account = new Account
            {
                AccountId = GenerateId(),
                Username = Account.UserName,
                FullName = Account.FullName,
                Password = Account.Password,
                DateOfBirth = Account.DateOfBirth != null ? (DateOnly)Account.DateOfBirth : null,
                Email = Account.Email,
                PhoneNumber = Account.PhoneNumber,
                RoleId = Account.RoleId,
                IsMale = Account.IsMale,
                JoinDate = DateOnly.FromDateTime(DateTime.Now),
                IsDisabled = isGoogle ? false : true,
            };

            try
            {
                await _accountService.Create(_account);
            }
            catch (BadHttpRequestException ex)
            {
                throw new BadHttpRequestException(
                    ex.Message,
                    ex.StatusCode,
                    ex.InnerException);
            }
            return _account;
        }

        public async Task DeleteAccount(Account Account)
        {
            var user = await _userManager.FindByEmailAsync(Account.Email);
            user.LockoutEnabled = !user.LockoutEnabled;
            if (user.LockoutEnabled)
            {
                user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            }
            await _userManager.UpdateAsync(user);
            var _account = new Account
            {
                AccountId = Account.AccountId,
                IsDisabled = true
            };
            await _accountService.DeleteAccount(_account);
        }

        public async Task<Account?> GetAccountByCondition(Expression<Func<Account, bool>> expression)
        {
            return await _accountService.GetByCondition(expression);
        }

        public async Task<Account?> GetAccountByRole(int roleId, string id)
        {
            var accounts = await GetAccountByCondition(a => a.RoleId == roleId && a.AccountId.Equals(id));
            if (accounts == null)
            {
                return null;
            }
            return accounts;
        }

        public async Task<IEnumerable<Account>> GetAllAccounts()
        {
            return await _accountService.GetAll();
        }

        public async Task<IEnumerable<Account>> GetAllAccountsByRole(int roleId)
        {
            return await _accountService.GetAccountsByRole(roleId);
        }

        public async Task UpdateAccount(string id, AccountUpdateDTO Account)
        {
            //    var _account = new Account
            //    {
            //        AccountId = id,
            //        FullName = Account.FullName,

            //        Email = Account.Email,
            //        PhoneNumber = Account.PhoneNumber,
            //        IsMale = Account.IsMale,
            //    };
            //await _accountService.Update(_account);
        }
        public async Task UpdateVetAccount(string id, AccountUpdateDTO VetAccount)
        {

            var _vetAccount = new Veterinarian
            {
                AccountId = id,
                RoleId = 3,
                Position = VetAccount.Position,
                Department = VetAccount.Department,
            };
            await _accountService.UpdateVetAccount(_vetAccount);
        }
        public string GenerateId(bool isVet = false)
        {
            string prefix = "";
            if (!isVet)
                prefix = "AC-";
            else
                prefix = "VE-";
            string id = Nanoid.Generate(size: 8);
            return prefix + id;
        }

        public async Task<bool> SetAccountIsDisabled(RequestAccountDisable account)
        {
            return await _accountService.SetAccountIsDisabled(account);
        }

        public async Task<bool> Any(Expression<Func<Account, bool>> expression)
        {
            return await _accountService.Any(expression);
        }

        public async Task CreateInternalUser(InternalAccountDTO dto, string password)
        {
            try
            {
                switch (dto.RoleId)
                {
                    // Vet
                    case 3:
                        {
                            var _account = new Veterinarian
                            {
                                AccountId = GenerateId(isVet: true),
                                Username = dto.UserName,
                                FullName = dto.FullName,
                                Password = password,
                                DateOfBirth = dto.DateOfBirth != null ? (DateOnly)dto.DateOfBirth : null,
                                Email = dto.Email,
                                PhoneNumber = dto.PhoneNumber,
                                RoleId = dto.RoleId,
                                IsMale = dto.IsMale,
                                JoinDate = DateOnly.FromDateTime(DateTime.Now),
                                IsDisabled = false,
                                ImgUrl = dto.ImgUrl,
                                Description = dto.Description,
                                Department = dto.Department,
                                Position = dto.Position,
                                Experience = dto.Experience
                            };
                            await _accountService.CreateVet(_account);
                            break;
                        }
                    // Staff
                    case 4:
                        {
                            var _account = new Account
                            {
                                AccountId = GenerateId(),
                                Username = dto.UserName,
                                FullName = dto.FullName,
                                Password = password,
                                DateOfBirth = dto.DateOfBirth != null ? (DateOnly)dto.DateOfBirth : null,
                                Email = dto.Email,
                                PhoneNumber = dto.PhoneNumber,
                                RoleId = dto.RoleId,
                                IsMale = dto.IsMale,
                                JoinDate = DateOnly.FromDateTime(DateTime.Now),
                                IsDisabled = false,
                            };
                            await _accountService.Create(_account);
                            break;
                        }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex.InnerException);
            }
        }

        public async Task<IEnumerable<VetListDTO>> GetVetListToChoose(DateOnly date, int timeslotId)
        {
            return await _accountService.GetVetListToChoose(date, timeslotId);
        }

        public async Task UpdateAccPassword(AccountUpdatePassDTO account)
        {
            var Account = new Account
            {
                Email = account.Email,
                Password = account.Password,
            };
            await _accountService.UpdateAccPassword(Account);
        }

        public async Task UnlockAccount(string accountId)
        {
            try
            {
                var account = await _accountService.GetByCondition(a => a.AccountId.Equals(accountId));
                if (account != null)
                {
                    var user = await _userManager.FindByEmailAsync(account.Email);
                    user.LockoutEnabled = false;
                    await _userManager.UpdateAsync(user);
                    await _accountService.UnlockAccount(accountId);
                }
                else throw new BadHttpRequestException("No such account");
            } catch (Exception ex)
            {
                throw new Exception("There's something wrong");
            }
        }
    }
}
