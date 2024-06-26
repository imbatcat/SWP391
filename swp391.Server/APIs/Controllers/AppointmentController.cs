﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff,Admin,Customer,Vet")]

    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointment;

        public AppointmentController(IAppointmentService appointment)
        {
            _appointment = appointment;
        }

        // GET: api/Services
        [HttpGet("GetAll/{vetId}")]
        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointment([FromRoute] string vetId)
        {
            return await _appointment.GetAllAppointment(vetId);
        }
        //[HttpGet("Staff/AppointmentList/history")]
        //[Authorize(Roles = "Staff, Admin")]
        //public async Task<IEnumerable<AppointmentForStaffDTO>> GetHistoryAppointmentOfToday()
        //{
        //    return await _appointment.GetStaffHistoryAppointment();
        //}
        [HttpGet("Staff/AppointmentList/")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<ActionResult<IEnumerable<AppointmentForStaffDTO>>> GetAllAppointmentForStaffWithCondition(DateOnly date, int timeslot, bool isGetAllTimeSlot = true)
        {
            IEnumerable<AppointmentForStaffDTO> appointmentList = new List<AppointmentForStaffDTO>();
            try
            {
                if (isGetAllTimeSlot)
                {
                    timeslot = 0;
                }
                appointmentList = await _appointment.GetAllAppointmentForStaff(date, timeslot);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(appointmentList);
        }
        // GET: api/Services/5
        [Authorize(Roles = "Customer")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointmentByCondition(string id)
        {
            var appointment = await _appointment.GetAppointmentByCondition(a => a.AppointmentId.Equals(id));

            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found" });
            }

            return appointment;
        }
        [HttpGet("admin/{accountId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<GetAllAppointmentForAdminDTO>>> GetAllAppointmentForAdminByAccountId([FromRoute] string accountId)
        {
            if (accountId == null)
            {
                return BadRequest(new { message = "Account id must not null" });
            }
            else if (await _appointment.GetAccountById(accountId) == null)
            {
                return NotFound(new { message = "Account id not found" });
            }
            IEnumerable<GetAllAppointmentForAdminDTO> appointmentList = await _appointment.GetAllAppointmentByAccountId(accountId);
            if (appointmentList.Count() == 0)
            {
                return NotFound(new { message = "Can't find that account id or Account don't have any appointment" });
            }
            return Ok(appointmentList);
        }

        [HttpGet("AppointmentList/{accountId}&{listType}")]
        [Authorize(Roles = "Customer,Admin, Vet")]
        public async Task<ActionResult<IEnumerable<ResAppListForCustomer>>> GetCustomerAppointmentList([FromRoute] string accountId, [FromRoute] string listType)
        {
            IEnumerable<ResAppListForCustomer> appointmentList = new List<ResAppListForCustomer>();
            try
            {
                if (!listType.Equals("history", StringComparison.OrdinalIgnoreCase)
                &&
               !listType.Equals("current", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = "listType must be current or history" });
                }
                appointmentList = await _appointment.getAllCustomerAppointment(accountId, listType);
            }
            catch (Exception ex)
            {
                if (ex.Message.Equals("Can't find that Account"))
                {
                    return NotFound(new { message = "Can't find that account id" });
                }
                if (ex.Message.Equals("The history list is empty"))
                {
                    return NotFound(new { message = "The history list is empty" });
                }
                else if (ex.Message.Equals("The current list is empty"))
                {
                    return NotFound(new { message = "The current list is empty" });
                }
            }

            return Ok(appointmentList);
        }

        //[HttpGet("AppointmentList/{accountId}&{typeOfSorting}&{orderBy}")]
        //[Authorize(Roles = "Customer,Admin")]
        //public async Task<ActionResult<IEnumerable<ResAppListForCustomer>>> GetSortedListByDate(string accountId, string typeOfSorting, string orderBy = "asc")
        //{
        //    //IEnumerable<ResAppListForCustomer> sortedAppointment = new List<ResAppListForCustomer>();
        //    if (!typeOfSorting.Equals("history", StringComparison.OrdinalIgnoreCase)
        //        &&
        //       !typeOfSorting.Equals("current", StringComparison.OrdinalIgnoreCase))
        //    {
        //        return BadRequest(new { message = "typeOfSorting must be current or history" });
        //    }
        //    if (!orderBy.Equals("asc", StringComparison.OrdinalIgnoreCase)
        //        &&
        //       !orderBy.Equals("desc", StringComparison.OrdinalIgnoreCase))
        //    {
        //        return BadRequest(new { message = "orderBy must be asc or desc" });
        //    }
        //    var sortedAppointment = await _appointment.SortAppointmentByDate(accountId, typeOfSorting, orderBy);
        //    if (sortedAppointment == null)
        //        try
        //        {
        //            sortedAppointment = await _appointment.SortAppointmentByDate(accountId, typeOfSorting, orderBy);
        //        }
        //        catch (Exception ex)
        //        {
        //            if (ex.Message.Equals("Can't find that Account"))
        //            {
        //                return NotFound(new { message = "Can't find that account id" });
        //            }
        //            if (ex.Message.Equals("The history list is empty"))
        //            {
        //                return NotFound(new { message = "The history list is empty" });
        //            }
        //            else if (ex.Message.Equals("The current list is empty"))
        //            {
        //                return NotFound(new { message = "The current list is empty" });
        //            }
        //        }
        //    return Ok(sortedAppointment);
        //}

        //[HttpGet("AppointmetList/ViewAppointmentForVet")]
        //[Authorize(Roles = "Admin,Vet")]
        ////get all appointment of a day for Vet to view
        //public async Task<ActionResult<IEnumerable<AppointmentListForVetDTO>>> ViewAppointmentListForVet(string VetId, DateOnly date)
        //{
        //    Console.WriteLine(date);
        //    if (await _appointment.GetAccountById(VetId) is null)
        //    {
        //        return NotFound(new { message = "Can't find that VetId" });
        //    }
        //    else if (date.CompareTo(new DateOnly(1, 1, 1)) == 0)
        //    {
        //        return BadRequest(new { message = "Please enter date in format mm/dd/yyyy" });
        //    }
        //    IEnumerable<AppointmentListForVetDTO> appointmentList = await _appointment.ViewAppointmentListForVet(VetId, date);
        //    return Ok(appointmentList);
        //}
        //[HttpGet("AppointmetList/VetAppointment/{vetId}")]
        //[Authorize(Roles = "Admin,Vet")]
        //public async Task<ActionResult<IEnumerable<VetAppointment>>> GetAllVetAppointment([FromRoute] string vetId)
        //{
        //    var appointmentList = await _appointment.ViewVetAppointmentList(vetId);
        //    return Ok(appointmentList);
        //}

        // Get list of active appointments by timeslot in a week
        //[Authorize(Roles = "Admin, Vet")]
        //[HttpPost("AppointmentList/by-week/{startWeek}&{endWeek}")]
        //public async Task<IEnumerable<AppointmentForVetDTO>> GetAppointmentsByWeek([FromRoute] DateOnly startWeek, [FromRoute] DateOnly endWeek, [FromBody] TimeslotDTO timeslot)
        //{
        //    return await _appointment.GetAppointmentsByTimeDate(startWeek, endWeek, timeslot);
        //}


        // PUT: api/Services/5
        [HttpPut("{id}")]
        //Update TimeSlot, Appointment
        public async Task<IActionResult> UpdateAppointment([FromRoute] string id, [FromBody] CustomerAppointmentDTO toUpdateAppointment)
        {
            DateOnly curDate = DateOnly.FromDateTime(DateTime.Today);
            try
            {
                Appointment? appointemnt = await _appointment.GetAppointmentByCondition(a => a.AppointmentId.Equals(id));
                if (appointemnt != null)
                {
                    if (appointemnt.AppointmentDate <= curDate.AddDays(1))
                    {
                        return BadRequest("You can only modify appointment more than 1 day before the appointment date");
                    }
                }
                else
                {
                    return BadRequest(new { message = "Appointment not found" });
                }
                if (toUpdateAppointment.AppointmentDate <= curDate.AddDays(1))
                {
                    return BadRequest(new { message = "Please choose date higher than the day after current day" });
                }
                else if (toUpdateAppointment.AppointmentNotes.Length > 200)
                {
                    return BadRequest(new { message = "Appointment notes is too long please enter lower than 200 character" });
                }
                if (!_appointment.isVetIdValid(toUpdateAppointment.VeterinarianAccountId))
                {
                    return BadRequest(new { message = "Invalid foreign key VetId" });
                }
                await _appointment.UpdateAppointment(id, toUpdateAppointment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(toUpdateAppointment);
        }

        // POST: api/Services
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Customer,Staff,Admin")]
        public async Task<ActionResult<CreateAppointmentDTO>> CreateAppointment([FromBody] CreateAppointmentDTO toCreateAppointment)
        {
            try
            {
                string appointmentId = "AP-" + Nanoid.Generate(size: 8);
                await _appointment.CreateAppointment(toCreateAppointment, appointmentId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(toCreateAppointment);
        }

        [HttpPost("Checkin/{appointmentId}")]
        public async Task<IActionResult> CheckInCustomer(string appointmentId) //api for customer to checkin for the customer
        {
            bool appointmentStatus = await _appointment.UpdateCheckinStatus(appointmentId);
            if (!appointmentStatus)
            {
                return NotFound(new { message = "appointment not found, checkin failed" });
            }
            return Ok(new { message = "Checkin successfully" });
        }
        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApppointment([FromRoute] string id)
        {
            var appointment = await _appointment.GetAppointmentByCondition(a => a.AppointmentId.Equals(id));
            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found" });
            }
            _appointment.DeleteAppointment(appointment);
            return Ok(appointment);
        }
    }
}
