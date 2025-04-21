import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { TreasureMap } from '../types';
import { getHistory, getDetail } from '../services/api';

const HistoryList = () => {
  const [treasureMaps, setTreasureMaps] = useState<TreasureMap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<TreasureMap | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHistory();
      setTreasureMaps(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Có lỗi xảy ra khi tải lịch sử. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await getDetail(id);
      setSelectedMap(data);
      setOpen(true);
    } catch (err) {
      console.error('Error fetching detail:', err);
      // Show error in alert or toast
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMap(null);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render matrix in a grid format
  const renderMatrix = () => {
    if (!selectedMap || !selectedMap.matrices || selectedMap.matrices.length === 0) {
      return <Typography>Không có dữ liệu ma trận</Typography>;
    }

    // Sort matrices by row and column
    const sortedMatrices = [...selectedMap.matrices].sort((a, b) => {
      if (a.rowIndex === b.rowIndex) {
        return a.columnIndex - b.columnIndex;
      }
      return a.rowIndex - b.rowIndex;
    });

    // Get max row and column indices
    const maxRow = Math.max(...sortedMatrices.map(m => m.rowIndex));
    const maxCol = Math.max(...sortedMatrices.map(m => m.columnIndex));

    // Create 2D array representation
    const grid: number[][] = Array(maxRow + 1).fill(0)
      .map(() => Array(maxCol + 1).fill(0));

    // Fill grid with values
    sortedMatrices.forEach(matrix => {
      grid[matrix.rowIndex][matrix.columnIndex] = matrix.value;
    });

    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2, 
          border: '1px solid rgba(0,0,0,0.1)', 
          borderRadius: 1,
          maxWidth: 'fit-content',
          mx: 'auto'
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 60 }}></TableCell>
              {Array(maxCol + 1).fill(0).map((_, col) => (
                <TableCell 
                  key={col} 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    width: 60,
                    p: 1.5
                  }}
                >
                  {col + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {grid.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    p: 1.5
                  }}
                >
                  {rowIndex + 1}
                </TableCell>
                {row.map((value, colIndex) => (
                  <TableCell 
                    key={colIndex} 
                    align="center"
                    sx={{ 
                      p: 1.5,
                      fontWeight: value === selectedMap?.p ? 'bold' : 'normal',
                      backgroundColor: value === selectedMap?.p ? 'rgba(25, 118, 210, 0.1)' : 'inherit'
                    }}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Lịch sử tính toán</Typography>
        <Button 
          variant="outlined" 
          onClick={fetchHistory} 
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {treasureMaps.length === 0 ? (
        <Alert severity="info">Chưa có dữ liệu lịch sử tính toán</Alert>
      ) : (
        <TableContainer sx={{ maxHeight: 'calc(100vh - 240px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Số P</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treasureMaps.map((map) => (
                <TableRow key={map.id} hover>
                  <TableCell>{map.id}</TableCell>
                  <TableCell>{map.n} x {map.m}</TableCell>
                  <TableCell>{map.p}</TableCell>
                  <TableCell>{map.result}</TableCell>
                  <TableCell>{formatDateTime(map.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleViewDetail(map.id)}
                      disabled={detailLoading}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết bài toán #{selectedMap?.id}
        </DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Thông tin chung</Typography>
                <Typography>Kích thước: {selectedMap?.n} x {selectedMap?.m}</Typography>
                <Typography>Số P: {selectedMap?.p}</Typography>
                <Typography>Kết quả: {selectedMap?.result}</Typography>
                <Typography>Thời gian tạo: {selectedMap && formatDateTime(selectedMap.createdAt)}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>Ma trận đầu vào</Typography>
              {renderMatrix()}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HistoryList; 