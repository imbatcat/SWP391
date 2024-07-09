using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.APIs.Controllers
{
    [Route("api/feedback-management")]
    [Authorize(Roles = "Admin, Customer")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackService _context;

        public FeedbacksController(IFeedbackService context)
        {
            _context = context;
        }

        // GET: api/Feedbacks
        [HttpGet("feedbacks")]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<Feedback>> GetFeedbacks()
        {
            return await _context.GetAllFeedback();
        }
        [HttpGet("usernames/{UserName}/feedbacks")]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserName([FromRoute] string UserName)
        {
            return await _context.GetFeedbacksByUserName(UserName);
        }
        //// GET: api/Feedbacks/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Feedback>> GetFeedback(int id)
        //{
        //    var feedback = await _context.Feedbacks.FindAsync(id);

        //    if (feedback == null)
        //    {
        //        return NotFound();
        //    }

        //    return feedback;
        //}


        // POST: api/Feedbacks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("feedbacks")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<Feedback>> PostFeedback([FromBody] FeedbackDTO feedback)
        {
            await _context.CreateFeedback(feedback);
            return CreatedAtAction(nameof(PostFeedback), new { id = feedback.GetHashCode() }, feedback);
        }

        ////DELETE: api/Feedbacks/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteFeedback([FromRoute]int id)
        //{
        //    var feedback = _context.GetFeedbackByCondition(e=>e.FeedbackId == id);
        //    if (feedback == null)
        //    {
        //        return NotFound();
        //    }
        //    _context.deleteFeedback(feedback);

        //    return NoContent();
        //}
    }
}