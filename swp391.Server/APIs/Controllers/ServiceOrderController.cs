﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Identity.Client;
using PetHealthcare.Server.APIs.DTOS;
using PetHealthcare.Server.APIs.DTOS.ServiceOrderDTO;
using PetHealthcare.Server.APIs.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Admin,Vet")]
    public class ServiceOrderController : ControllerBase
    {
        private readonly IServiceOrderService _serviceOrderService;
        private readonly IHealthService _healthService;
        public ServiceOrderController(IServiceOrderService _serviceOrder, IHealthService _healthService)
        {
            this._serviceOrderService = _serviceOrder;
            this._healthService = _healthService;
        }
        [HttpGet("Staff")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff()
        {
            return await _serviceOrderService.getAllServiceOrderForStaff();
        }
        [HttpPost]
        public async Task<IActionResult> createServiceOrder([FromBody]ServiceOrderDTO serviceOrderDTO)
        {
            if(serviceOrderDTO.ServiceId == null)
            {
                return BadRequest(new { message = "ServiceId is null" });
            }
            foreach(int serviceId in serviceOrderDTO.ServiceId) 
            {
                if (_healthService.GetHealthServiceByCondition(h => h.ServiceId == serviceId) == null)
                {
                    return BadRequest(new { message = "ServiceId not found" });
                }
            }
            await _serviceOrderService.CreateServiceOrder(serviceOrderDTO);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceOrder(string id, [FromBody] List<int> serviceIdList)
        {
            if(serviceIdList.Count == 0)
            {
                return BadRequest(new {message = "serviceIdList is empty"});
            }
            await _serviceOrderService.UpdateServiceOrder(id, serviceIdList);
            return Ok();
        }

        
        [HttpPut("/OrderStatus/{serviceOrderId}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> UpdateOrderStatus(string orderStatus, [FromRoute]string serviceOrderId)
        {
            if(!orderStatus.Equals("Paid") && !orderStatus.Equals("Pending") && !orderStatus.Equals("Cancel"))
            {
                return BadRequest(new { message = "OrderStatus must be Paid, Pending or Cancel" });
            }
            await _serviceOrderService.UpdateOrderStatus(orderStatus, serviceOrderId);
            return Ok();
        }
    }
}