import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import AppRoutes from './routes/Routes';
import PersistentMusicPlayer from './components/PersistentMusicPlayer';
import ErrorBoundary from './components/ErrorBoundary';
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
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
              <PersistentMusicPlayer />
            </MusicProvider>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
