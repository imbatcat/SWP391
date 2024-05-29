﻿using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.APIs.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CagesController : ControllerBase
    {
        private readonly ICageService _context;

        public CagesController(ICageService context)
        {
            _context = context;
        }

        // GET: api/<CagesController>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Cage>))]
        public async Task<IEnumerable<Cage>> GetCages()
        {
            return await _context.GetAllCages();
        }

        // GET api/<CagesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cage>> GetCage([FromRoute] int id)
        {
            var cage = await _context.GetCageByCondition(a => a.CageId == id);

            if (cage == null)
            {
                return NotFound();
            }

            return cage;
        }

        // POST api/<CagesController>
        [HttpPost]
        public async Task<ActionResult<Cage>> Post([FromBody] CageDTO newCage)
        {
            await _context.CreateCage(newCage);

            return CreatedAtAction(nameof(Post), newCage.GetHashCode(), newCage);
        }

        // PUT api/<CagesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Cage>> Put(int id, [FromBody] CageDTO CaGe)
        {
            var cage = await _context.GetCageByCondition(c => c.CageId == id);
            if (cage == null)
            {
                return BadRequest("No such cage");
            }
            await _context.UpdateCage(id, CaGe);
            return Ok();
        }

        // DELETE api/<CagesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {

        }
    }
}
