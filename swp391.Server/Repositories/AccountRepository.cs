using Microsoft.EntityFrameworkCore;
using PetHealthcare.Server.Core.Constant;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly PetHealthcareDbContext context;

        public AccountRepository(PetHealthcareDbContext context)
        {
            this.context = context;
        }

        public async Task SaveChanges()
        {
            await context.SaveChangesAsync();
        }

        public async Task Create(Account entity)
        {
            try
            {
                await context.Accounts.AddAsync(entity);
                await SaveChanges();

            }
            catch (DbUpdateException ex)
            {
                throw new BadHttpRequestException(
                    ex.Message,
                    ex.InnerException);
            }

        }

        public async void Delete(Account entity)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Account>> GetAll()
        {
            return await context.Accounts.ToListAsync();
        }

        public async Task<Account?> GetByCondition(Expression<Func<Account, bool>> expression)
        {
            return await context.Accounts.FirstOrDefaultAsync(expression);
        }

        public async Task Update(Account entity)
        {
            var account = await GetByCondition(e => e.AccountId == entity.AccountId);
            if (account != null)
            {
                context.Entry(account).State = EntityState.Modified;
                account.FullName = entity.FullName;
                account.Username = entity.Username;
                account.Password = entity.Password;
                await SaveChanges();
            }
        }
        public bool CheckRoleId(int roleId)
        {
            return context.Roles.Any(r => r.RoleId == roleId);
        }
        public async Task<IEnumerable<Account>> GetAccountsByRole(int roleId)
        {
            if (!CheckRoleId(roleId))
            {
                return null;
            }
            var list = await GetAll();
            List<Account> accounts = new List<Account>();
            foreach (Account acc in list)
            {
                if (acc.RoleId == roleId)
                {
                    accounts.Add(acc);
                }
            }
            return accounts;
        }

        public async Task<Account?> GetAccountByRole(int roleId, string id)
        {
            var accounts = await GetByCondition(a => a.RoleId == roleId && a.AccountId.Equals(id));
            if (accounts == null)
            {
                return null;
            }
            return accounts;
        }

        public async Task<bool> SetAccountIsDisabled(RequestAccountDisable entity)
        {
            var account = await GetByCondition(e => e.Username == entity.username);
            if (account != null)
            {
                context.Entry(account).State = EntityState.Modified;
                account.IsDisabled = entity.IsDisabled;
                await SaveChanges();
                return true;
            }
            return false;
        }

        public async Task DeleteAccount(Account entity)
        {
            var acc = await GetByCondition(a => a.AccountId == entity.AccountId);
            if (acc != null)
            {
                context.Entry(acc).State = EntityState.Modified;
                acc.IsDisabled = entity.IsDisabled;
                await SaveChanges();
                
            }
        }

        public async Task<bool> Any(Expression<Func<Account, bool>> predicate)
        {
            return await context.Accounts.AnyAsync(predicate);
        }

        public async Task CreateVet(Veterinarian veterinarian)
        {
            await context.Accounts.AddAsync(veterinarian);
            await SaveChanges();
        }

        public async Task<IEnumerable<VetListDTO>> GetVetListToChoose(DateOnly date, int timeslotId)
        {
            List<Appointment> appointments = await context.Appointments.Include("TimeSlot").Include("Account").ToListAsync();
            List<Veterinarian> veterinarians = await context.Veterinarians.ToListAsync();
            List<VetListDTO> vetListToChoose = new List<VetListDTO>();
            foreach(Veterinarian vet in veterinarians)
            {
                int currentCapacity = 0;
                foreach(Appointment appointment in appointments)
                {
                    if(appointment.VeterinarianAccountId.Equals(vet.AccountId) && appointment.AppointmentDate.CompareTo(date) == 0 && appointment.TimeSlotId == timeslotId)
                    {
                        currentCapacity++;
                    }
                }
                vetListToChoose.Add(new VetListDTO
                {
                    Department = vet.Department,
                    Experience = vet.Experience,
                    VetId = vet.AccountId,
                    VetName = vet.FullName,
                    CurrentCapacity = currentCapacity + "/" + ProjectConstant.MAX_APP_PER_TIMESLOT
                });
            }
            return vetListToChoose;
        }

        public async Task UpdateAccPassword(Account entity)
        {
            var account = await GetByCondition(e => e.Email == entity.Email);
            if (account != null)
            {
                context.Entry(account).State = EntityState.Modified;
                account.Password = entity.Password;
                await SaveChanges();
            }
        }

        public async Task UnlockAccount(string accountId)
        {
            var entity = await GetByCondition(e => e.AccountId == accountId);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Modified;
                entity.IsDisabled = false;
                await SaveChanges();
            }
        }
    }
}
