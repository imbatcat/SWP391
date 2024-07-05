using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{

    [Route("api/[controller]")]
    [Authorize(Roles = "Staff,Vet, Customer, Admin")]
    [ApiController]
    public class AdmissionRecordController : ControllerBase
    {
        private readonly IAdmissionRecordService _context;
        private readonly IPetService _petContext;


        public AdmissionRecordController(IAdmissionRecordService context, IPetService petContext)
        {
            _petContext = petContext;
            _context = context;
        }

        [HttpGet("/api/AdmissionRecord")]
        [Authorize(Roles = "Admin, Staff")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AdmissionRecord>))]
        public async Task<IEnumerable<AdmissionRecord>> GetAllAdmissionRecords()
        {
            return await _context.GetAll();
        }

        [HttpGet("/api/AdmissionRecord/{name}")]
        public async Task<ActionResult<ARSearchPetNameDTO>> GetAdmissionRecordByCondition([FromRoute] string name)   //----Get Addmission Record by name
        {
            var service = await _petContext.GetPetByName(a => a.PetName == name);
            ARSearchPetNameDTO born;

            if (service == null)
            {
                return NotFound();
            }
            else
            {
                born = new ARSearchPetNameDTO(service.AdmissionId, service.AdmissionDate, service.DischargeDate, service.IsDischarged, service.PetCurrentCondition, service.MedicalRecordId, service.VeterinarianAccountId, service.PetId, service.CageId);
            }

            return born;
        }

        //Get all admission Records of a Pet from Pet Id
        [HttpGet("/api/admRecByPet/{petId}")]
        public async Task<IEnumerable<AdmissionRecord>> GetAdmissionRecordsByPet([FromRoute] string petId)
        {
            return await _petContext.GetAdmissionRecordsByPet(petId);
        }

        [HttpPut("/api/AdmissionRecord/{id}")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> UpdateAdmissionRecord([FromRoute] string id, [FromBody] AdmissionRecordDTO toUpdate)
        {
            var service = await _context.GetAdmissionRecordByPetName(p => p.AdmissionId.Equals(id));

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            await _context.UpdateAdmissionRecord(id, toUpdate);
            return Ok(toUpdate);
        }

        [HttpPost("/api/AdmissionRecord")]
        [Authorize(Roles = "Staff,Admin, Vet")]
        public async Task<ActionResult<AdmissionRecord>> CreateAdmissionRecord([FromBody] AdmissionRecordRegisterDTO _new)
        {
            await _context.CreateAdmissionRecord(_new);

            return CreatedAtAction(nameof(CreateAdmissionRecord), _new.GetHashCode(), _new);
        }
    }
}
