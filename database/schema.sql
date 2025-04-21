-- Tạo database
CREATE DATABASE IF NOT EXISTS TreasureFind;
USE TreasureFind;

-- Tạo bảng TreasureMap để lưu thông tin input và kết quả
CREATE TABLE IF NOT EXISTS TreasureMap (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    N INT NOT NULL,  -- Số hàng
    M INT NOT NULL,  -- Số cột
    P INT NOT NULL,  -- Số loại rương
    Result FLOAT NOT NULL,  -- Kết quả tính toán (lượng nhiên liệu)
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng Matrix để lưu ma trận input
CREATE TABLE IF NOT EXISTS Matrix (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TreasureMapId INT NOT NULL,
    RowIndex INT NOT NULL,  -- Chỉ số hàng (0-based)
    ColumnIndex INT NOT NULL,  -- Chỉ số cột (0-based)
    Value INT NOT NULL,  -- Giá trị tại vị trí (i,j) - số thứ tự của rương
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (TreasureMapId) REFERENCES TreasureMap(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Matrix_Position UNIQUE (TreasureMapId, RowIndex, ColumnIndex)
);

-- Tạo index để tối ưu hiệu suất truy vấn
CREATE INDEX IX_TreasureMap_CreatedAt ON TreasureMap(CreatedAt);
CREATE INDEX IX_Matrix_TreasureMapId ON Matrix(TreasureMapId); 