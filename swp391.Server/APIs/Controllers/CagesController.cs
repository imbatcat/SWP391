using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/cage-management")]
    [Authorize(Roles = "Staff,Vet,Admin")]
    [ApiController]
    public class CagesController : ControllerBase
    {
        private readonly ICageService _context;

        public CagesController(ICageService context)
        {
            _context = context;
        }

        // GET: api/<CagesController>
        [HttpGet("cages")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Cage>))]
        public async Task<IEnumerable<Cage>> GetCages()
        {
            return await _context.GetAllCages();
        }

        // GET api/<CagesController>/5
        [HttpGet("cages/{id}")]
        public async Task<ActionResult<Cage>> GetCage([FromRoute] int id)
        {
            var cage = await _context.GetCageByCondition(a => a.CageId == id);

            if (cage == null)
            {
                return NotFound();
            }

            return cage;
        }

        [HttpGet("cages-pets")]
        public async Task<IEnumerable<CageWithPetDTO>> GetAllCagesWithPet()
        {
            return await _context.GetAllCagesWithPet();
        }
        // POST api/<CagesController>
        [HttpPost("cages")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult<Cage>> Post([FromBody] CageDTO newCage)
        {
            await _context.CreateCage(newCage);

            return CreatedAtAction(nameof(Post), newCage.GetHashCode(), newCage);
        }

        //PUT: Update Pet Condition
        [HttpPut("cages/pets/{petId}")]
        public async Task UpdateCondition([FromRoute] string petId, [FromBody] UpdatePetConditionDTO updatePetConditionDTO)
        {
            await _context.UpdateCondition(petId, updatePetConditionDTO);
        }

        // PUT api/<CagesController>/5
        [HttpPut("cages/{id}")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult<Cage>> Put(int id, [FromBody] CageDTO CaGe)
        {
            var cage = await _context.GetCageByCondition(c => c.CageId == id);
            if (cage == null)
            {
                return BadRequest("No such cage");
            }
            await _context.UpdateCage(id, CaGe);
            return Ok(CaGe);
        }

        // DELETE api/<CagesController>/5
        [HttpDelete("cages{id}")]
        public void Delete(int id)
        {

        }

        //DELETE: change isDischarge = true.
        [HttpDelete("cages/pets/{petId}/discharge-pet")]
        public async Task DischargePet(string petId)
        {
            await _context.DischargePet(petId);
        }
    }
}
