using System.Collections.Generic;
using System.Threading.Tasks;
using Find.Treasure.Core.Entities;

namespace Find.Treasure.Core.Interfaces.Repository
{
    public interface ICalculateRepository : IBaseRepository<TreasureMap>
    {
        Task<TreasureMap> AddAsync(TreasureMap entity);
        Task SaveMatrixAsync(Matrix matrix);
        Task SaveMatricesAsync(IEnumerable<Matrix> matrices);
        Task<IEnumerable<TreasureMap>> GetTreasureMapsAsync();
        Task<TreasureMap> GetTreasureMapDetailAsync(int id);
    }
}
