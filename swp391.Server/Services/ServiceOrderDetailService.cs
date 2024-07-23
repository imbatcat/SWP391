using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class ServiceOrderDetailService : IServiceOrderDetailService
    {
        private readonly IServiceOrderDetailRepository _repository;
        private readonly IServiceOrderService _serviceOrderService;
        private readonly IMedicalRecordService _medicalRecordService;
        private readonly IAccountService _accountService;
        private readonly IAppointmentService _appointmentService;

        public ServiceOrderDetailService(IServiceOrderDetailRepository repository, IServiceOrderService serviceOrderService, IMedicalRecordService medicalRecordService, IAccountService accountService, IAppointmentService appointmentService)
        {
            _repository = repository;
            _serviceOrderService = serviceOrderService;
            _medicalRecordService = medicalRecordService;
            _accountService = accountService;
            _appointmentService = appointmentService;
        }

        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetail()
        {
            IEnumerable<ServiceOrderDetails> orDetailList = await _repository.getAllServieOrderDetail();
            var medRecList = await _medicalRecordService.GetAllMedicalRecord();
            List<ServiceOrderDetailDTO> serviceOrderDetailList = new List<ServiceOrderDetailDTO>();
            var currentDate = DateOnly.FromDateTime(DateTime.Today);
            foreach (ServiceOrderDetails detail in orDetailList)
            {
                foreach (var medRec in medRecList)
                {
                    var id = detail.ServiceOrderId;
                    var serviceOrder = await _serviceOrderService.GetServiceOrderById(id);
                    if (medRec.ServiceOrders != null)
                    {
                        if (medRec.ServiceOrders.Any(a => a.ServiceOrderId.Equals(detail.ServiceOrderId)) && serviceOrder.OrderStatus == "Pending" && serviceOrder.OrderDate.CompareTo(currentDate) == 0)
                        {
                            var appointment = await _appointmentService.GetAppointmentByCondition(
                                app => app.AppointmentId.Equals(medRec.AppointmentId));
                            serviceOrderDetailList.Add(new ServiceOrderDetailDTO
                            {
                                OrderId = detail.ServiceOrderId,
                                ServiceName = detail.Service.ServiceName,
                                Price = detail.Service.ServicePrice,
                                AppointmentId = appointment.AppointmentId,
                                PhoneNumber = appointment.Account.PhoneNumber,
                                PetName = appointment.Pet.PetName,  
                                OwnerName = appointment.Account.FullName
                            });
                        }
                    }
                }
            }
            return serviceOrderDetailList;
        }

        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetailByServiceOrderId(string serviceId)
        {
            IEnumerable<ServiceOrderDetails> orDetailList = await _repository.getAllServieOrderDetail();
            List<ServiceOrderDetailDTO> serviceOrderDetailList = new List<ServiceOrderDetailDTO>();
            foreach (ServiceOrderDetails detail in orDetailList)
            {
                if (detail.ServiceOrderId.Equals(serviceId, StringComparison.OrdinalIgnoreCase))
                {
                    serviceOrderDetailList.Add(new ServiceOrderDetailDTO
                    {
                        OrderId = detail.ServiceOrderId,
                        ServiceName = detail.Service.ServiceName,
                        Price = detail.Service.ServicePrice,
                    });
                }
            }
            return serviceOrderDetailList;
        }
    }
}
