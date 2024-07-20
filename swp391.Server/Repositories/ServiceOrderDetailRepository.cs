using Microsoft.EntityFrameworkCore;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories
{
    public class ServiceOrderDetailRepository : IServiceOrderDetailRepository
    {
        private PetHealthcareDbContext context;
        public ServiceOrderDetailRepository(PetHealthcareDbContext context)
        {
            this.context = context;
        }
        public Task Create(ServiceOrderDetails entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(ServiceOrderDetails entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ServiceOrderDetails>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ServiceOrderDetails>> getAllServieOrderDetail()
        {
            return await context.ServiceOrderDetails
                .Include("Service")
                .Include("ServiceOrder")
                .AsNoTracking().ToListAsync();
        }

        public Task<ServiceOrderDetails?> GetByCondition(Expression<Func<ServiceOrderDetails, bool>> expression)
        {
            throw new NotImplementedException();
        }

        public Task SaveChanges()
        {
            throw new NotImplementedException();
        }

        public Task Update(ServiceOrderDetails entity)
        {
            throw new NotImplementedException();
        }
    }
}
