using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Find.Treasure.Core.DTOs;
using Find.Treasure.Core.Entities;
using Find.Treasure.Core.Interfaces.Repository;
using Find.Treasure.Core.Interfaces.Services;

namespace Find.Treasure.Core.Services
{
    public class CalculateService : BaseService<TreasureMap>, ICalculateService
    {
        private readonly ICalculateRepository _calculateRepository;

        public CalculateService(ICalculateRepository calculateRepository) : base(calculateRepository)
        {
            _calculateRepository = calculateRepository;
        }

        public async Task<CalculateResponse> CalculateAsync(CalculateRequest request)
        {
            // Tính toán kết quả
            var result = Calculate(request.N, request.M, request.P, request.Grid);
            float resultValue = float.Parse(result);

            // Lưu vào database
            var treasureMap = new TreasureMap
            {
                N = request.N,
                M = request.M,
                P = request.P,
                Result = resultValue,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _calculateRepository.AddAsync(treasureMap);

            // Tạo danh sách ma trận để lưu
            var matrices = new List<Matrix>();
            for (int i = 0; i < request.N; i++)
            {
                for (int j = 0; j < request.M; j++)
                {
                    matrices.Add(new Matrix
                    {
                        TreasureMapId = treasureMap.Id,
                        RowIndex = i,
                        ColumnIndex = j,
                        Value = request.Grid[i, j],
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            // Lưu tất cả ma trận cùng lúc
            await _calculateRepository.SaveMatricesAsync(matrices);

            return new CalculateResponse
            {
                Id = treasureMap.Id,
                Result = resultValue
            };
        }

        public async Task<IEnumerable<TreasureMap>> GetHistoryAsync()
        {
            return await _calculateRepository.GetTreasureMapsAsync();
        }

        public async Task<TreasureMap> GetDetailAsync(int id)
        {
            return await _calculateRepository.GetTreasureMapDetailAsync(id);
        }

        /// <summary>
        /// Dùng cấu trúc dữ liệu: List<(int x, int y)>[] chests để lưu đồ thị. 
        /// Với chests[1] → danh sách các tọa độ chứa rương số 1
        /// Dùng thuật toán dijkstra để tìm đường đi ngắn nhất
        /// </summary>
        /// <param name="n">Số hàng</param>
        /// <param name="m">Số cột</param>
        /// <param name="p">Số p</param>
        /// <param name="grid">Ma trận</param>
        /// <returns></returns>
        private string Calculate(int n, int m, int p, int[,] grid)
        {
            var chests = new List<(int, int)>[p + 1];
            for (int i = 0; i <= p; i++) chests[i] = new List<(int, int)>();

            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    chests[grid[i, j]].Add((i, j));
                }
            }

            // Bắt đầu từ (0,0), tìm chi phí đến các rương số 1
            Dictionary<(int, int), double> costMap = new();

            foreach (var (x, y) in chests[1])
                costMap[(x, y)] = Euclid(0, 0, x, y);

            // Từ các rương 1 đến p
            for (int k = 1; k < p; k++)
            {
                Dictionary<(int, int), double> nextCostMap = new();

                // Dijkstra từ các vị trí rương k đến rương k+1
                var Q = new HashSet<(int, int)>();
                Dictionary<(int, int), bool> known = new();
                Dictionary<(int, int), double> d = new();

                // Khởi tạo
                foreach (var pos in chests[k])
                {
                    d[pos] = costMap[pos];
                    Q.Add(pos);
                    known[pos] = false;
                }

                while (Q.Count > 0)
                {
                    // Tìm đỉnh u có d[u] nhỏ nhất
                    (int ux, int uy) = Q.OrderBy(pos => d[pos]).First();
                    Q.Remove((ux, uy));
                    known[(ux, uy)] = true;

                    // Với mỗi v là rương k+1
                    foreach (var (vx, vy) in chests[k + 1])
                    {
                        if (known.ContainsKey((vx, vy)) && known[(vx, vy)]) continue;

                        double alt = d[(ux, uy)] + Euclid(ux, uy, vx, vy);

                        if (!d.ContainsKey((vx, vy)) || alt < d[(vx, vy)])
                        {
                            d[(vx, vy)] = alt;
                            Q.Add((vx, vy));
                            known[(vx, vy)] = false;
                        }
                    }
                }

                // Cập nhật chi phí cho các vị trí rương k+1
                foreach (var pos in chests[k + 1])
                    if (d.ContainsKey(pos))
                        nextCostMap[pos] = d[pos];

                costMap = nextCostMap;
            }

            // Trả kết quả nhỏ nhất ở rương p
            double result = costMap.Values.Min();

            return result.ToString("0.#####");
        }

        private double Euclid(int x1, int y1, int x2, int y2)
        {
            int dx = x1 - x2;
            int dy = y1 - y2;
            return Math.Sqrt(dx * dx + dy * dy);
        }
    }
}
