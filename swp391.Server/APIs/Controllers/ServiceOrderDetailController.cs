using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Vet")]
    public class ServiceOrderDetailController : ControllerBase
    {
        
        private readonly IServiceOrderDetailService serviceOrderDetail;
        public ServiceOrderDetailController(IServiceOrderDetailService serviceOrderDetail)
        {
            this.serviceOrderDetail = serviceOrderDetail;
        }

        
        [HttpGet("Staff/ServiceOrderDetail")]
        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetail()
        {
            return await serviceOrderDetail.getAllServieOrderDetail();
        }

        [HttpGet("Staff/ServiceOrderDetail/{serviceId}")]
        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetailByServiceOrderId([FromRoute] string serviceId)
        {
            return await serviceOrderDetail.getAllServieOrderDetailByServiceOrderId(serviceId);
        }
    }
}
