import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import AppRoutes from './routes/Routes';
import PersistentMusicPlayer from './components/PersistentMusicPlayer';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <MusicProvider>
              <AppRoutes />
              <PersistentMusicPlayer />
            </MusicProvider>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;