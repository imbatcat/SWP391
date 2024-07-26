using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using PetHealthcare.Server.Core.Constant;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Diagnostics;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/vn-pay-api-management")]
    [ApiController]
    public class VNPayAPIController : ControllerBase
    {
        private readonly AppointmentService _appointmentService;
        private readonly PetHealthcareDbContext context;
        private readonly BookingPaymentService bookingPaymentService;
        private readonly IVnPayService _vnPayService;
        private readonly IAuthenticationService _authenticationService;
        public VNPayAPIController(IVnPayService vnPayService, PetHealthcareDbContext context, AppointmentService appointmentService,
            BookingPaymentService _bookingPaymentService, IAuthenticationService _authenticationService)
        {
            _vnPayService = vnPayService;
            this.context = context;
            _appointmentService = appointmentService;
            bookingPaymentService = _bookingPaymentService;
            this._authenticationService = _authenticationService;
        }
        
        // GET: VNPayController
        [HttpPost("make-payment")]
        public async  Task<ActionResult<VNPayResponseUrl>> CreatePaymentUrl([FromBody] CreateAppointmentDTO model)
        {
            CreateAppointmentDTO appointmentDTO = model;
            //string vetId, DateOnly appDate, int timeslotId, bool isCreate
            if(await _appointmentService.IsPetAppointmentExist(model.PetId, model.AccountId))
            {
                return BadRequest(new { message = "The customer already book an appointment for this pet" });
            }
            if(model.AppointmentDate < DateOnly.FromDateTime(DateTime.Today).AddDays(1))
            {
                return BadRequest("The customer can only book an appointment at least one day in advance from the current date.");
            }

            if (await MaxTimeslotCheck.isMaxTimeslotReached(_appointmentService,model.VeterinarianAccountId, model.AppointmentDate, model.TimeSlotId, true))
            {
                return BadRequest("Timeslot full please choose another timeslot");
            }

            //TempData["AppointmentDTO"] = JsonSerializer.Serialize(appointmentDTO);
            VnPayDataStoreHelper.SaveAppointmentData(model);
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(new VNPayResponseUrl { Url = url });
        }

        [HttpPost("payment-callback")]
        public async Task<IActionResult> PaymentCallback([FromForm] IFormCollection form)
        {
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(string.Join("&", form.Select(x => $"{x.Key}={x.Value}")));
            var response = _vnPayService.PaymentExecute(new QueryCollection(query));
            CreateAppointmentDTO appointmentDTO = VnPayDataStoreHelper.getAppointment();
            Debug.WriteLine(appointmentDTO.AccountId);
            try
            {
                if (response.VnPayResponseCode.Equals("00"))
                {
                    string appointmentId = _appointmentService.GenerateId();

                    await _appointmentService.CreateAppointment(appointmentDTO, appointmentId);
                    Debug.WriteLine(appointmentId);
                    if (context.Appointments.Find(appointmentId) != null)
                    {
                        var bookingPayment = new BookingPayment
                        {
                            PaymentId = bookingPaymentService.GenerateBookingPaymentId(),
                            PaymentMethod = "VNPay",
                            PaymentDate = response.PaymentDate,
                            Price = ProjectConstant.DEPOSIT_COST,
                            AppointmentId = appointmentId,
                        };
                        context.BookingPayments.Add(bookingPayment);
                        AppointmentEmailDTO appointmentEmailDTO = await _appointmentService.CreateAppointmentEmail(appointmentId);
                        await _authenticationService.SendAppointmentEmail(appointmentEmailDTO);
                    }
                    else
                    {
                        Debug.WriteLine("Add appointment failed");
                    }

                }
                else
                {
                    Debug.WriteLine("Transaction failed" + response.VnPayResponseCode);
                }

                context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return Ok(response);
        }
    }
}
