import { useState } from 'react';
import { Typography, Box, Tab, Tabs, CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Container } from '@mui/material';
import InputForm from './components/InputForm';
import HistoryList from './components/HistoryList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCalculateSuccess = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh'
      }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5">
              Tìm Kho Báu
            </Typography>
          </Toolbar>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="primary"
            sx={{ bgcolor: 'white' }}
          >
            <Tab label="Tính toán" />
            <Tab label="Lịch sử" />
          </Tabs>
        </AppBar>
        
        <Container 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            py: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <TabPanel value={tabValue} index={0}>
            <InputForm onCalculateSuccess={handleCalculateSuccess} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <HistoryList key={refreshHistory} />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
