using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using PetHealthcare.Server.Core.Constant;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services;
using PetHealthcare.Server.Services.Interfaces;
using System.Diagnostics;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VNPayAPIController : ControllerBase
    {
        private readonly ITempDataDictionaryFactory _tempDataDictionaryFactory;
        private readonly AppointmentService _appointmentService;
        private readonly PetHealthcareDbContext context;
        private readonly BookingPaymentService bookingPaymentService;
        public VNPayAPIController(IVnPayService vnPayService, PetHealthcareDbContext context, AppointmentService appointmentService,
            BookingPaymentService _bookingPaymentService, ITempDataDictionaryFactory tempDataDictionaryFactory)
        {
            _vnPayService = vnPayService;
            this.context = context;
            _appointmentService = appointmentService;
            bookingPaymentService = _bookingPaymentService;
            _tempDataDictionaryFactory = tempDataDictionaryFactory;
        }
        private ITempDataDictionary TempData => _tempDataDictionaryFactory.GetTempData(HttpContext);
        private readonly IVnPayService _vnPayService;
        // GET: VNPayController
        [HttpPost]
        public async  Task<ActionResult<VNPayResponseUrl>> CreatePaymentUrl([FromBody] CreateAppointmentDTO model)
        {
            CreateAppointmentDTO appointmentDTO = model;
            //string vetId, DateOnly appDate, int timeslotId, bool isCreate
            if (await MaxTimeslotCheck.isMaxTimeslotReached(_appointmentService,model.VeterinarianAccountId, model.AppointmentDate, model.TimeSlotId, true))
            {
                return BadRequest("Timeslot full please choose another timeslot");
            }
            TempData["AppointmentDTO"] = JsonSerializer.Serialize(appointmentDTO);
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(new VNPayResponseUrl { Url = url });
        }

        [HttpPost("PaymentCallback")]
        public async Task<IActionResult> PaymentCallback([FromForm] IFormCollection form)
        {
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(string.Join("&", form.Select(x => $"{x.Key}={x.Value}")));
            var response = _vnPayService.PaymentExecute(new QueryCollection(query));
            CreateAppointmentDTO appointmentDTO = new CreateAppointmentDTO();
            try
            {
                if (TempData.ContainsKey("AppointmentDTO"))
                {
                    var appointmentJson = TempData["AppointmentDTO"].ToString();
                    appointmentDTO = JsonSerializer.Deserialize<CreateAppointmentDTO>(appointmentJson);
                }
                else
                {
                    Debug.WriteLine("No appointment data in TempData");
                    return BadRequest("No appointment data");
                }
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
