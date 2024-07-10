using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories.Interfaces
{
    public interface IAccountRepository : IRepositoryBase<Account>
    {
        Task<IEnumerable<Account>> GetAccountsByRole(int roleId);
        Task<Account?> GetAccountByRole(int roleId, string id);
        Task<bool> SetAccountIsDisabled(RequestAccountDisable account);
        Task DeleteAccount(Account account);

        Task CreateVet(Veterinarian veterinarian);
        Task<bool> Any(Expression<Func<Account, bool>> predicate);
        Task<IEnumerable<VetListDTO>> GetVetListToChoose(DateOnly date, int timeslotId);
        Task UpdateVetAccount(Veterinarian veterinarian);
    }
}
