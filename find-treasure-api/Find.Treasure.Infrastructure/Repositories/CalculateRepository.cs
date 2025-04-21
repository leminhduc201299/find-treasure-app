using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Find.Treasure.Core.Entities;
using Find.Treasure.Core.Interfaces.Repository;
using Microsoft.Extensions.Options;
using MySqlConnector;

namespace Find.Treasure.Infrastructure.Repositories
{
    public class CalculateRepository : BaseRepository<TreasureMap>, ICalculateRepository
    {
        public CalculateRepository(IOptions<FindTreasureSettings> findTreasureSettings) : base(findTreasureSettings)
        {
        }

        public async Task SaveMatrixAsync(Matrix matrix)
        {
            const string sql = @"
                INSERT INTO Matrix (TreasureMapId, RowIndex, ColumnIndex, Value, CreatedAt, UpdatedAt)
                VALUES (@TreasureMapId, @RowIndex, @ColumnIndex, @Value, @CreatedAt, @UpdatedAt)";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.ExecuteAsync(sql, matrix);
            }
        }

        public async Task SaveMatricesAsync(IEnumerable<Matrix> matrices)
        {
            const string sql = @"
                INSERT INTO Matrix (TreasureMapId, RowIndex, ColumnIndex, Value, CreatedAt, UpdatedAt)
                VALUES (@TreasureMapId, @RowIndex, @ColumnIndex, @Value, @CreatedAt, @UpdatedAt)";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.ExecuteAsync(sql, matrices);
            }
        }

        public override async Task<int> ExecuteUsingStoredProcedure(string storeName, object param)
        {
            return await base.ExecuteUsingStoredProcedure(storeName, param);
        }

        public override async Task<List<T>> QueryUsingStoredProcedure<T>(string storeName, object param)
        {
            return await base.QueryUsingStoredProcedure<T>(storeName, param);
        }

        public async Task<TreasureMap> AddAsync(TreasureMap entity)
        {
            const string sql = @"
                INSERT INTO TreasureMap (N, M, P, Result, CreatedAt, UpdatedAt)
                VALUES (@N, @M, @P, @Result, @CreatedAt, @UpdatedAt);
                SELECT LAST_INSERT_ID();";

            using (var connection = new MySqlConnection(_connectionString))
            {
                var id = await connection.ExecuteScalarAsync<int>(sql, entity);
                entity.Id = id;
                return entity;
            }
        }

        public async Task<IEnumerable<TreasureMap>> GetTreasureMapsAsync()
        {
            const string sql = @"
                SELECT Id, N, M, P, Result, CreatedAt, UpdatedAt
                FROM TreasureMap
                ORDER BY CreatedAt DESC";

            using (var connection = new MySqlConnection(_connectionString))
            {
                return await connection.QueryAsync<TreasureMap>(sql);
            }
        }

        public async Task<TreasureMap> GetTreasureMapDetailAsync(int id)
        {
            const string sqlTreasureMap = @"
                SELECT Id, N, M, P, Result, CreatedAt, UpdatedAt
                FROM TreasureMap
                WHERE Id = @Id";

            const string sqlMatrix = @"
                SELECT Id, TreasureMapId, RowIndex, ColumnIndex, Value, CreatedAt, UpdatedAt
                FROM Matrix
                WHERE TreasureMapId = @Id
                ORDER BY RowIndex, ColumnIndex";

            using (var connection = new MySqlConnection(_connectionString))
            {
                var treasureMap = await connection.QuerySingleOrDefaultAsync<TreasureMap>(sqlTreasureMap, new { Id = id });
                
                if (treasureMap != null)
                {
                    var matrices = await connection.QueryAsync<Matrix>(sqlMatrix, new { Id = id });
                    treasureMap.Matrices = matrices.ToList();
                }

                return treasureMap;
            }
        }
    }
} 