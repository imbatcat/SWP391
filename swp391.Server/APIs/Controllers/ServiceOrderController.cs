﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/service-order-management")]
    [ApiController]
    [Authorize(Roles = "Admin,Vet, Staff")]
    public class ServiceOrderController : ControllerBase
    {
        private readonly IServiceOrderService _serviceOrderService;
        private readonly IHealthService _healthService;
        public ServiceOrderController(IServiceOrderService _serviceOrder, IHealthService _healthService)
        {
            this._serviceOrderService = _serviceOrder;
            this._healthService = _healthService;
        }

        //----------------------------------------------
        [HttpGet("service-orders/date{date}/unpaid-list/{isUnPaidList}/staff")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getServiceOrderListForStaff(DateOnly date, bool isUnPaidList = true) //staff using isUnpaidList = true
        {
            return await _serviceOrderService.getServiceOrderListForStaff(date, isUnPaidList);
        }

        //----------------------------------------------
        [HttpGet("service-orders/staff")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff()
        {
            return await _serviceOrderService.getAllServiceOrderForStaff();
        }

        //----------------------------------------------
        [HttpGet("services/{serviceOrderId}/service-orders")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<ServiceOrderInfor> getServiceOrderInforByServiceId(string serviceOrderId)
        {
            return await _serviceOrderService.getServiceOrderInforByServiceId(serviceOrderId);
        }

        //----------------------------------------------
        [HttpPost("service-orders")]
        public async Task<IActionResult> createServiceOrder([FromBody] ServiceOrderDTO serviceOrderDTO)
        {
            if (serviceOrderDTO.ServiceId == null)
            {
                return BadRequest(new { message = "ServiceId is null" });
            }
            foreach (int serviceId in serviceOrderDTO.ServiceId)
            {
                if (_healthService.GetHealthServiceByCondition(h => h.ServiceId == serviceId) == null)
                {
                    return BadRequest(new { message = "ServiceId not found" });
                }
            }
            await _serviceOrderService.CreateServiceOrder(serviceOrderDTO);
            return Ok();
        }

        //----------------------------------------------
        [HttpPut("service-orders/{serviceOrderId}/paid")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> PaidServiceOrder([FromRoute] string serviceOrderId)
        {
            bool paidResult = await _serviceOrderService.PaidServiceOrder(serviceOrderId);
            if (paidResult)
            {
                return Ok(new { message = "Paid successfully" });
            }
            return BadRequest(new { message = "Paid failed" });
        }

        //----------------------------------------------
        [HttpPut("service-orders/{id}")]
        public async Task<IActionResult> UpdateServiceOrder(string id, [FromBody] List<int> serviceIdList)
        {
            try
            {
                if (serviceIdList.Count == 0)
                {
                    return BadRequest(new { message = "serviceIdList is empty" });
                }
                await _serviceOrderService.UpdateServiceOrder(id, serviceIdList);
            }
            catch (Exception ex)
            {
                if (ex.Message.Equals("Can't update paid ServiceOrder"))
                {
                    return BadRequest("Can't update paid ServiceOrder");
                }
                else if (ex.Message.Equals("Can't find that Service Order Id"))
                {
                    return NotFound("Can't find that Service Order Id");
                }
            }
            return Ok();
        }

    }
}
