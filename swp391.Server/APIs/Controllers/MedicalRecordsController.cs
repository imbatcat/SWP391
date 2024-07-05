using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Vet, Customer, Staff")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _context;
        private readonly IPetService _petService;

        public MedicalRecordsController(IMedicalRecordService context, IPetService petService)
        {
            _context = context;
            _petService = petService;
        }

        // GET: api/MedicalRecords
        [HttpGet("")]
        [Authorize(Roles = "Admin, Vet")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecords()
        {
            return await _context.GetAllMedicalRecord();
        }

        // GET: api/MedicalRecords/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Vet")]
        public async Task<ActionResult<MedicalRecord>> GetMedicalRecord(string id)
        {
            var medicalRecord = await _context.GetMedicalRecordByCondition(m => m.MedicalRecordId == id);

            if (medicalRecord == null)
            {
                return NotFound();
            }

            return medicalRecord;
        }

        //Get all medical Records of a Pet from Pet Id
        [HttpGet("/api/medRecByPet/{petId}")]
        [Authorize(Roles = "Vet, Admin, Customer")]
        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPet([FromRoute] string petId)
        {
            return await _petService.GetMedicalRecordsByPet(petId);
        }
        [HttpGet("/api/medicalRecordByAppointmentId/{appointmentId}")]
        [Authorize(Roles = "Vet")]
        public async Task<MedicalRecordVetDTO> GetMedicalRecordsByAppointmentId([FromRoute] string appointmentId)
        {
            return await _context.GetMedicalRecordsByAppointmentId(appointmentId);
        }
        //GET: get all medical Records of a veterinarian from VetId
        [HttpGet("/api/medicalRecordsByVetId/{VetId}")]
        [Authorize(Roles = "Vet")]
        public async Task<IEnumerable<MedicalRecordVetDTO>> GetMedicalRecordByVetId([FromRoute] string VetId)
        {
            return await _context.GetMedicalRecordsByVetId(VetId);
        }
        //PUT: api/MedicalRecords/5
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Vet, Staff, Admin")]
        public async Task<IActionResult> PutMedicalRecord(string id, MedicalRecordDTO medicalRecord)
        {
            await _context.UpdateMedicalRecord(id, medicalRecord);
            return NoContent();
        }

        // POST: api/MedicalRecords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Vet, Staff, Customer, Admin")]
        public async Task<ActionResult<MedicalRecordResDTO>> PostMedicalRecord([FromBody] MedicalRecordResDTO medicalRecordDTO)
        {
            await _context.CreateMedicalRecord(medicalRecordDTO);
            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateException)
            //{
            //    if (MedicalRecordExists(medicalRecord.MedicalRecordId))
            //    {
            //        return Conflict();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return CreatedAtAction(nameof(PostMedicalRecord), new { id = medicalRecordDTO.PetId + medicalRecordDTO.AppointmentId }, medicalRecordDTO);
        }

        //// DELETE: api/MedicalRecords/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteMedicalRecord(string id)
        //{
        //    var medicalRecord = await _context.MedicalRecords.FindAsync(id);
        //    if (medicalRecord == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.MedicalRecords.Remove(medicalRecord);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool MedicalRecordExists(string id)
        //{
        //    return _context.MedicalRecords.Any(e => e.MedicalRecordId == id);
        //}
    }
}
