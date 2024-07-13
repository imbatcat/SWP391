using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/appointment-management")]
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
        [HttpGet("vets/get-all")]
        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointment()
        {
            return await _appointment.GetAllAppointment();
        }

        [HttpGet("vets/{vetId}/appointments")]
        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointmentsForVet([FromRoute] string vetId)
        {
            return await _appointment.ViewAppointmentListForVet(vetId);
        }

        [HttpGet("staff/get-all")]
        public async Task<ActionResult<IEnumerable<AppointmentForStaffDTO>>> GetAllAppointmentForStaff()
        {
            IEnumerable<AppointmentForStaffDTO> appointmentsList = await _appointment.GetAllAppointmentsForStaff();
            return Ok(appointmentsList);
        }
        //[HttpGet("Staff/AppointmentList/history")]
        //[Authorize(Roles = "Staff, Admin")]
        //public async Task<IEnumerable<AppointmentForStaffDTO>> GetHistoryAppointmentOfToday()
        //{
        //    return await _appointment.GetStaffHistoryAppointment();
        //}
        [HttpGet("dates/{date}/time-slots/{timeslot}/appointments/staff")]
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
        [HttpGet("appointments/{id}")]
        public async Task<ActionResult<Appointment>> GetAppointmentByCondition(string id)
        {
            var appointment = await _appointment.GetAppointmentByCondition(a => a.AppointmentId.Equals(id));

            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found" });
            }

            return appointment;
        }
        [HttpGet("accounts/{accountId}/appointments/admin")]
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

        [HttpGet("appointments/accounts/{accountId}/lists/{listType}")]
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

        [HttpGet("QRCode")]
        public string getQRCodeByAppointmentId(string appointmentId)
        {
            return _appointment.GetQRCodeByAppointmentId(appointmentId);
        }

        // PUT: api/Services/5
        [HttpPut("appointments/{id}")]
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
                
                if(appointemnt.AppointmentDate.CompareTo(toUpdateAppointment.AppointmentDate) == 0) //check if the appointment update the date, if they dont update appointment date and timeslot is full, it still allow to update another field
                {
                    await _appointment.UpdateAppointment(id, toUpdateAppointment, false);
                } else
                {
                    await _appointment.UpdateAppointment(id, toUpdateAppointment, true);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(toUpdateAppointment);
        }

        // POST: api/Services
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("appointments")]
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
        
        [HttpPost("appointments/{appointmentId}/check-in")]
        public async Task<IActionResult> CheckInCustomer(string appointmentId) //api for customer to checkin for the customer
        {
            try
            {
                bool appointmentStatus = await _appointment.UpdateCheckinStatus(appointmentId);
                if (!appointmentStatus)
                {
                    return NotFound(new { message = "appointment not found, checkin failed" });
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Equals("Wrong checkin day"))
                {
                    return BadRequest(ex.Message);
                }
            }
            return Ok(new { message = "Checkin successfully" });
        }
    }
}
