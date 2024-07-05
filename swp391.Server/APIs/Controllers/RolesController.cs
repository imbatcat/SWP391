using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _context;

        public RolesController(IRoleService context)
        {
            _context = context;
        }


        // GET: api/Roles
        [HttpGet]
        public async Task<IEnumerable<Role>> GetRole()
        {
            return await _context.GetAllRole();
        }

        //// GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRoleByCondition(int id)
        {
            var role = await _context.GetRoleByCondition(r => r.RoleId == id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        //// PUT: api/Roles/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole([FromRoute] int id, [FromBody] RoleDTO toUpdateRole)
        {
            var role = await _context.GetRoleByCondition(r => r.RoleId == id);
            if (role == null)
            {
                return BadRequest();
            }
            await _context.UpdateRole(id, toUpdateRole);
            return Ok(toUpdateRole);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole([FromRoute] int id)
        {
            var toDeleteRole = await _context.GetRoleByCondition(r => r.RoleId == id);
            if (toDeleteRole == null)
            {
                return NotFound(new { message = "Role not found" });
            }
            _context.DeleteRole(toDeleteRole);
            return Ok(toDeleteRole);
        }
    }
}
