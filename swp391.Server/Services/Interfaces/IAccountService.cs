using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using System.Linq.Expressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PetHealthcare.Server.Services.Interfaces
{
    public interface IAccountService
    {
        Task<IEnumerable<Account>> GetAllAccounts();
        Task<IEnumerable<Account>> GetAllAccountsByRole(int roleId);
        Task<Account?> GetAccountByRole(int roleId, string id);
        Task<Account?> GetAccountByCondition(Expression<Func<Account, bool>> expression);
        Task<Account?> CreateAccount(AccountDTO Account, bool isGoogle);
        Task DeleteAccount(Account Account);
        Task<bool> SetAccountIsDisabled(RequestAccountDisable account);
        Task<bool> Any(Expression<Func<Account, bool>> expression);

        Task CreateInternalUser(InternalAccountDTO dto, string password);
        string GenerateId(bool isVet);

        Task<IEnumerable<VetListDTO>> GetVetListToChoose(DateOnly date, int timeslotId);
        Task UpdateAccount(string id, StaffUpdateDTO Account);
        Task UpdateVetAccount(string id, AccountUpdateDTO VetAccount);
        Task UpdateCustomerAccount(string id, CustomerUpdateDTO CustomerAccount);
        Task UpdateAccPassword(AccountUpdatePassDTO account);
        Task UnlockAccount(string accountId);
    }
}
