using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Vet, Staff, Customer, Admin")]
    [ApiController]
    public class TimeSlotsController : ControllerBase
    {
        private readonly ITimeSlotService _context;

        public TimeSlotsController(ITimeSlotService context)
        {
            _context = context;
        }

        // GET: api/Accounts
        [HttpGet()]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TimeSlot>))]
        public async Task<IEnumerable<TimeSlot>> GetTimeSlots()
        {
            return await _context.GetAllTimeSlots();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TimeSlot>> GetTimeSlotByCondition(int id)
        {
            var service = await _context.GetTimeSlotByCondition(p => p.TimeSlotId == id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // PUT: api/Services/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> UpdateTimeSlot([FromRoute] int id, [FromBody] TimeslotDTO toUpdateTimeSlot)
        {
            var service = await _context.GetTimeSlotByCondition(p => p.TimeSlotId == id);
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            await _context.UpdateTimeSlot(id, toUpdateTimeSlot);
            return Ok(toUpdateTimeSlot);
        }

        // POST api/<CagesController>
        [HttpPost]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult<TimeSlot>> Post([FromBody] TimeslotDTO newCage)
        {
            await _context.CreateTimeSlot(newCage);

            return CreatedAtAction(nameof(Post), newCage.GetHashCode(), newCage);
        }
    }
}
