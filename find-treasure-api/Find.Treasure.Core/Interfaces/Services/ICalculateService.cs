using System.Collections.Generic;
using System.Threading.Tasks;
using Find.Treasure.Core.DTOs;
using Find.Treasure.Core.Entities;

namespace Find.Treasure.Core.Interfaces.Services
{
    public interface ICalculateService : IBaseService<TreasureMap>
    {
        Task<CalculateResponse> CalculateAsync(CalculateRequest request);
        Task<IEnumerable<TreasureMap>> GetHistoryAsync();
        Task<TreasureMap> GetDetailAsync(int id);
    }
}
