import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import RouteManager from './routes/RouteManager';
function App() {
  return (
    <AuthProvider>
      <RouteManager/>
    </AuthProvider>
  );
}

export default App;