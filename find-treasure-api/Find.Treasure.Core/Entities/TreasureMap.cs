using System;
using System.Collections.Generic;

namespace Find.Treasure.Core.Entities
{
    public class TreasureMap
    {
        public int Id { get; set; }
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public float Result { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<Matrix> Matrices { get; set; }
    }
} 