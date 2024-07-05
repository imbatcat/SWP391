using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories.Interfaces
{
    public interface IRepositoryBase<T>
    {
        Task<IEnumerable<T>> GetAll();
        Task<T?> GetByCondition(Expression<Func<T, bool>> expression);
        Task Create(T entity);
        Task Update(T entity);
        void Delete(T entity);
        Task SaveChanges();
    }

}
