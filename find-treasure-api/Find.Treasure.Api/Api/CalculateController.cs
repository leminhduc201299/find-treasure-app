using System;
using System.Threading.Tasks;
using Find.Treasure.Core.DTOs;
using Find.Treasure.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Find.Treasure.Api.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculateController : ControllerBase
    {
        private readonly ICalculateService _calculateService;

        public CalculateController(ICalculateService calculateService)
        {
            _calculateService = calculateService;
        }

        [HttpPost]
        public async Task<ActionResult<CalculateResponse>> Calculate([FromBody] CalculateRequest request)
        {
            try
            {
                var result = await _calculateService.CalculateAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetHistory()
        {
            try
            {
                var treasureMaps = await _calculateService.GetHistoryAsync();
                return Ok(treasureMaps);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving history.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetDetail(int id)
        {
            try
            {
                var treasureMap = await _calculateService.GetDetailAsync(id);
                
                if (treasureMap == null)
                {
                    return NotFound(new { message = $"Treasure map with ID {id} not found." });
                }
                
                return Ok(treasureMap);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving details.", error = ex.Message });
            }
        }
    }
}
