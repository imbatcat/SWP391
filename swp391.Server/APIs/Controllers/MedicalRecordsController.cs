﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/medical-record-management")]
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
        [HttpGet("medical-records")]
        [Authorize(Roles = "Admin, Vet")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecords()
        {
            return await _context.GetAllMedicalRecord();
        }

        // GET: api/MedicalRecords/5
        [HttpGet("medical-records/{id}")]
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
        [HttpGet("pets/{petId}/medical-records")]
        [Authorize(Roles = "Vet, Admin, Customer")]
        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPet([FromRoute] string petId)
        {
            return await _petService.GetMedicalRecordsByPet(petId);
        }
        [HttpGet("appointments/{appointmentId}/medical-records")]
        [Authorize(Roles = "Vet")]
        public async Task<MedicalRecordVetDTO?> GetMedicalRecordsByAppointmentId([FromRoute] string appointmentId)
        {
            var res = await _context.GetMedicalRecordsByAppointmentId(appointmentId);
            return res != null ? res : null;

        }
        //GET: get all medical Records of a veterinarian from VetId
        [HttpGet("vets/{VetId}/medical-records")]
        [Authorize(Roles = "Vet")]
        public async Task<IEnumerable<MedicalRecordVetDTO>> GetMedicalRecordByVetId([FromRoute] string VetId)
        {
            return await _context.GetMedicalRecordsByVetId(VetId);
        }

        //PUT: api/MedicalRecords/5
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("medical-records/{id}")]
        [Authorize(Roles = "Vet, Staff, Admin")]
        public async Task<IActionResult> PutMedicalRecord(string id, MedicalRecordDTO medicalRecord)
        {
            await _context.UpdateMedicalRecord(id, medicalRecord);
            return NoContent();
        }

        // POST: api/MedicalRecords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("medical-records")]
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

        [HttpPost("medical-records/create-empty")]
        [Authorize(Roles = "Vet, Staff, Customer, Admin")]
        public async Task<ActionResult<MedicalRecordResDTO>> CreateEmptyMedicalRecord([FromBody] MedicalRecordBlankDTO medicalRecordBlankDTO)
        {
            try
            {
                var response = await _context.CreateBlankMedicalRecord(medicalRecordBlankDTO);
                return CreatedAtAction(nameof(CreateEmptyMedicalRecord), new { id = medicalRecordBlankDTO.PetId + medicalRecordBlankDTO.AppointmentId }, response);
            } catch (BadHttpRequestException)
            {
                return BadRequest();
            }
                
        }
    }
}
