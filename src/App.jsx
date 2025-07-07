import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import RouteManager from './routes/RouteManager';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteManager/>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;