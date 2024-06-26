﻿using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;

namespace PetHealthcare.Server.Services.Interfaces
{
    public interface IServiceOrderService
    {
        Task CreateServiceOrder(ServiceOrderDTO orderDTO);
        Task UpdateServiceOrder(string id, List<int> serviceIdList);
        Task<ServiceOrder> GetServiceOrderById(string id);
        Task<IEnumerable<ServiceOrder>> GetAllServiceOrderByMedId(string medId);
        Task<IEnumerable<ServiceOrder>> GetAllServiceOrder();
        Task<bool> PaidServiceOrder(string ServiceOrderId);
        Task<IEnumerable<GetAllServiceOrderForStaff>> getServiceOrderListForStaff(DateOnly date, bool isUnpaidList);
        Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff();
        Task<ServiceOrderInfor> getServiceOrderInforByServiceId(string serviceOrderId);
    }
}
