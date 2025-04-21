using System;

namespace Find.Treasure.Core.Entities
{
    public class Matrix
    {
        public int Id { get; set; }
        public int TreasureMapId { get; set; }
        public int RowIndex { get; set; }
        public int ColumnIndex { get; set; }
        public int Value { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual TreasureMap TreasureMap { get; set; }
    }
} 