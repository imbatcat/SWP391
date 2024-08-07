﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/service-order-detail-management")]
    [ApiController]
    [Authorize(Roles = "Admin,Vet,Staff")]
    public class ServiceOrderDetailController : ControllerBase
    {

        private readonly IServiceOrderDetailService serviceOrderDetail;
        public ServiceOrderDetailController(IServiceOrderDetailService serviceOrderDetail)
        {
            this.serviceOrderDetail = serviceOrderDetail;
        }

        [HttpGet("service-order-details")]
        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetail()
        {
            return await serviceOrderDetail.getAllServieOrderDetail();
        }

        [HttpGet("service-order-details/service-orders/{serviceId}")]
        public async Task<IEnumerable<ServiceOrderDetailDTO>> getAllServieOrderDetailByServiceOrderId([FromRoute] string serviceId)
        {
            return await serviceOrderDetail.getAllServieOrderDetailByServiceOrderId(serviceId);
        }
    }
}
