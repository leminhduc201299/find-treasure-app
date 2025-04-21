using System.ComponentModel.DataAnnotations;

namespace Find.Treasure.Core.DTOs
{
    public class CalculateRequest
    {
        [Required]
        [Range(1, 500)]
        public int N { get; set; }

        [Required]
        [Range(1, 500)]
        public int M { get; set; }

        [Required]
        [Range(1, 250000)] // 500 * 500
        public int P { get; set; }

        [Required]
        public int[,] Grid { get; set; }
    }
} 