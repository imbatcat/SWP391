using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;

namespace PetHealthcare.Server.Repositories.Interfaces
{
    public interface IServiceOrderRepository : IRepositoryBase<ServiceOrder>
    {
        Task CreateServiceOrder(ServiceOrderDTO order);
        Task UpdateServiceOrder(string ServiceOrderId, List<int> ServiceId);
        Task<IEnumerable<GetAllServiceOrderForStaff>> GetServiceOrderListForStaff(DateOnly date, bool isUnpaidList);
        Task<bool> UpdateServiceOrderStatus(string serviceOrderId);
        Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff();
        Task<ServiceOrderInfor> getServiceOrderInforByServiceId(string serviceOrderid);

        Task<Service> GetServiceByName(string name);
    }
}
