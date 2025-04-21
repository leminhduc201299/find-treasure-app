using Find.Treasure.Core.Entities;
using Find.Treasure.Core.Interfaces.Repository;
using Find.Treasure.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Find.Treasure.Api.Api
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BaseDemoController<TEntity> : ControllerBase
    {
        #region Field
        IBaseService<TEntity> _baseService;
        IBaseRepository<TEntity> _baseRepository;
        private ServiceResult service = new ServiceResult();
        #endregion

        #region Contructor
        public BaseDemoController(IBaseService<TEntity> baseService, IBaseRepository<TEntity> baseRepository)
        {
            _baseService = baseService;
            _baseRepository = baseRepository;
        }
        #endregion

        #region Method
        
        #endregion
    }
}
