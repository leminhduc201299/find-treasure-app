using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Find.Treasure.Core.Entities
{
    public class ServiceResult
    {
        #region Properties
        /// <summary>
        /// Message cho dev
        /// </summary>
        public string DevMsg { get; set; }

        /// <summary>
        /// Thông báo cho người dùng
        /// </summary>
        public string UserMsg { get; set; }

        /// <summary>
        /// Mã lỗi
        /// </summary>
        public string ErrorCode { get; set; }

        /// <summary>
        /// Thông tin thêm về lỗi
        /// </summary>
        public string MoreInfo { get; set; }

        /// <summary>
        /// Dữ liệu
        /// </summary>
        public Object Data { get; set; }

        /// <summary>
        /// Service có thành công hay không
        /// </summary>
        public bool Success { get; set; } = true;
        #endregion
    }
}
