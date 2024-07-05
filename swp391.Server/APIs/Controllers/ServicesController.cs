using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Vet")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IHealthService _healthService;

        public ServicesController(IHealthService healthService)
        {
            _healthService = healthService;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<IEnumerable<Service>> GetService()
        {
            return await _healthService.GetAllHealthService();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetServiceByCondition(int id)
        {
            var service = await _healthService.GetHealthServiceByCondition(s => s.ServiceId == id);

            if (service == null)
            {
                return NotFound(new { message = "Service not found" });
            }

            return service;
        }

        // PUT: api/Services/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService([FromRoute] int id, [FromBody] HealthServiceDTO toUpdateService)
        {
            var service = await _healthService.GetHealthServiceByCondition(s => s.ServiceId == id);
            if (service == null)
            {
                return BadRequest(new { message = "update fail" });
            }
            await _healthService.UpdateHealthService(id, toUpdateService);
            return Ok(toUpdateService);
        }

        // POST: api/Services
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Service>> CreateService([FromBody] HealthServiceDTO toCreateService)
        {

            await _healthService.CreateHealthService(toCreateService);

            return Ok(toCreateService);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService([FromRoute] int id)
        {
            var toDeleteService = await _healthService.GetHealthServiceByCondition(s => s.ServiceId == id);
            if (toDeleteService == null)
            {
                return NotFound(new { message = "Service not found" });
            }
            _healthService.DeleteHealthService(toDeleteService);
            return Ok(toDeleteService);
        }
    }
}
