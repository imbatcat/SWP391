using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.Services
{
    public class ServiceOrderService : IServiceOrderService
    {
        private readonly IServiceOrderRepository _serviceOrderRepo;
        public ServiceOrderService(IServiceOrderRepository serviceRepo)
        {
            _serviceOrderRepo = serviceRepo;
        }
        public async Task CreateServiceOrder(ServiceOrderDTO orderDTO)
        {
            await _serviceOrderRepo.CreateServiceOrder(orderDTO);
        }

        public Task<IEnumerable<ServiceOrder>> GetAllServiceOrder()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ServiceOrder>> GetAllServiceOrderByMedId(string medId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceOrder> GetServiceOrderById(string id)
        {
            return await _serviceOrderRepo.GetByCondition(a => a.ServiceOrderId == id);
        }

        public async Task UpdateServiceOrder(string id, List<int> serviceIdList)
        {
            ServiceOrder? serviceOrder = await _serviceOrderRepo.GetByCondition(s => s.ServiceOrderId.Equals(id));
            if (serviceOrder == null)
            {
                throw new Exception("Can't find that Service Order Id");
            }
            else
            {
                if (serviceOrder.OrderStatus == "Pending")
                {
                    await _serviceOrderRepo.UpdateServiceOrder(id, serviceIdList);
                }
                else
                {
                    throw new Exception("Can't update paid ServiceOrder");
                }
            }
        }

        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getServiceOrderListForStaff(DateOnly date, bool isUnPaidList = true)
        {
            return await _serviceOrderRepo.GetServiceOrderListForStaff(date, isUnPaidList);
        }

        public async Task<bool> PaidServiceOrder(string ServiceOrderId)
        {
            return await _serviceOrderRepo.UpdateServiceOrderStatus(ServiceOrderId);
        }

        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff()
        {
            return await _serviceOrderRepo.getAllServiceOrderForStaff();
        }

        public async Task<ServiceOrderInfor> getServiceOrderInforByServiceId(string serviceOrderId)
        {
            return await _serviceOrderRepo.getServiceOrderInforByServiceId(serviceOrderId);
        }
    }
}
