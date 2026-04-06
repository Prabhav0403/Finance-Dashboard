import { AppProvider } from './context/AppContext';
import Navbar from './components/ui/Navbar';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
        <Navbar />
        <Dashboard />
      </div>
    </AppProvider>
  );
}
