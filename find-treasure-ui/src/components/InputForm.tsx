import { useState, ChangeEvent } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Stack,
  Paper, 
  Typography, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { CalculateRequest } from '../types';
import { calculateTreasure } from '../services/api';

interface InputFormProps {
  onCalculateSuccess: () => void;
}

const InputForm = ({ onCalculateSuccess }: InputFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [n, setN] = useState<number>(3);
  const [m, setM] = useState<number>(3);
  const [p, setP] = useState<number>(3);
  const [grid, setGrid] = useState<number[][]>(Array(3).fill(0).map(() => Array(3).fill(1)));
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 500) {
      setN(value);
      // Reset grid with new dimensions
      setGrid(Array(value).fill(0).map((_, i) => 
        Array(m).fill(0).map((_, j) => grid[i]?.[j] || 1)
      ));
    }
  };

  const handleMChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 500) {
      setM(value);
      // Reset grid with new dimensions
      setGrid(Array(n).fill(0).map((_, i) => 
        Array(value).fill(0).map((_, j) => grid[i]?.[j] || 1)
      ));
    }
  };

  const handlePChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= n * m) {
      setP(value);
    }
  };

  const handleCellChange = (row: number, col: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= p) {
      const newGrid = [...grid];
      newGrid[row][col] = value;
      setGrid(newGrid);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate grid values
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          if (grid[i][j] < 1 || grid[i][j] > p) {
            setError(`Giá trị tại vị trí (${i+1},${j+1}) phải từ 1 đến ${p}`);
            setLoading(false);
            return;
          }
        }
      }

      // Ensure there is at least one cell with value p
      const hasPValue = grid.some(row => row.some(cell => cell === p));
      if (!hasPValue) {
        setError(`Phải có ít nhất một ô có giá trị ${p}`);
        setLoading(false);
        return;
      }

      const request: CalculateRequest = {
        n,
        m,
        p,
        grid
      };

      const response = await calculateTreasure(request);
      setResult(response.result);
      onCalculateSuccess();
    } catch (err) {
      console.error('Error calculating treasure:', err);
      setError('Có lỗi xảy ra khi tính toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const renderGrid = () => {
    // Dynamic cell width based on screen size
    const cellWidth = isMobile ? 45 : isTablet ? 55 : 65;
    
    return (
      <Box sx={{ 
        overflowX: 'auto', 
        maxHeight: 'calc(100vh - 400px)',
        mt: 3,
        mb: 2
      }}>
        <TableContainer 
          component={Paper} 
          variant="outlined" 
          sx={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 1,
            maxWidth: 'fit-content',
            mx: 'auto'
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: cellWidth }}></TableCell>
                {Array(m).fill(0).map((_, col) => (
                  <TableCell 
                    key={col} 
                    align="center" 
                    padding={isMobile ? 'none' : 'normal'}
                    sx={{ fontWeight: 'bold', width: cellWidth }}
                  >
                    {col + 1}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(n).fill(0).map((_, row) => (
                <TableRow key={row}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    padding={isMobile ? 'none' : 'normal'}
                    sx={{ 
                      fontWeight: 'bold', 
                      textAlign: 'center', 
                      backgroundColor: 'rgba(0,0,0,0.04)' 
                    }}
                  >
                    {row + 1}
                  </TableCell>
                  {Array(m).fill(0).map((_, col) => (
                    <TableCell key={col} align="center" padding="none">
                      <TextField
                        type="number"
                        value={grid[row][col]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleCellChange(row, col, e)}
                        inputProps={{ 
                          min: 1, 
                          max: p, 
                          style: { 
                            textAlign: 'center',
                            padding: isMobile ? '10px 6px' : '12px 8px',
                            fontWeight: grid[row][col] === p ? 'bold' : 'normal'
                          } 
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          width: cellWidth,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: grid[row][col] === p ? 'primary.main' : 'rgba(0, 0, 0, 0.23)',
                              borderWidth: grid[row][col] === p ? 2 : 1
                            }
                          }
                        }}
                        error={grid[row][col] < 1 || grid[row][col] > p}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box 
      component={Paper} 
      p={0} 
      width="100%" 
      sx={{ 
        borderRadius: 2,
        boxShadow: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Nhập dữ liệu
        </Typography>
      
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={3} 
          width="100%" 
          sx={{ mt: 2 }}
        >
          <Box width={{ xs: '100%', sm: '33.33%' }}>
            <TextField
              label="Số hàng (n)"
              type="number"
              fullWidth
              value={n}
              onChange={handleNChange}
              inputProps={{ min: 1, max: 500 }}
              required
              margin="normal"
              helperText="1 ≤ n ≤ 500"
              error={n < 1 || n > 500}
            />
          </Box>
          <Box width={{ xs: '100%', sm: '33.33%' }}>
            <TextField
              label="Số cột (m)"
              type="number"
              fullWidth
              value={m}
              onChange={handleMChange}
              inputProps={{ min: 1, max: 500 }}
              required
              margin="normal"
              helperText="1 ≤ m ≤ 500"
              error={m < 1 || m > 500}
            />
          </Box>
          <Box width={{ xs: '100%', sm: '33.33%' }}>
            <TextField
              label="Số p"
              type="number"
              fullWidth
              value={p}
              onChange={handlePChange}
              inputProps={{ min: 1, max: n * m }}
              required
              margin="normal"
              helperText={`1 ≤ p ≤ ${n * m}`}
              error={p < 1 || p > n * m}
            />
          </Box>
        </Stack>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 1 }} fontWeight="medium">
          Nhập ma trận
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ maxHeight: '100vh' }} gutterBottom>
          Giá trị từ 1 đến {p}
        </Typography>

        {renderGrid()}

        {error && (
          <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
            {error}
          </Alert>
        )}

        {result !== null && (
          <Alert severity="success" sx={{ mt: 3, mb: 2 }}>
            Kết quả: {result}
          </Alert>
        )}

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{ mt: 3, mb: 1, py: 1.5, fontSize: '1rem' }}
        >
          {loading ? 'Đang tính toán...' : 'Tính toán'}
        </Button>
      </Box>
    </Box>
  );
};

export default InputForm; 