import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages lazy loads
import Home from './pages/Home';
import Explore from './pages/Explore';
import CountryDetails from './pages/CountryDetails';
import Favorites from './pages/Favorites';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import About from './pages/About';

// Standard QueryClient definition
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <HashRouter>
          {/* Main App Container */}
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            
            {/* Visual gradient light spotlights in backgrounds */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/2 blur-3xl pointer-events-none z-0" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/2 blur-3xl pointer-events-none z-0" />

            <div className="flex relative z-10 max-w-[1600px] mx-auto p-0 md:p-4 gap-4">
              
              {/* Left Collapsible Floating Sidebar (Desktop Only) */}
              <Sidebar />

              {/* Right Viewport (Scrollable container) */}
              <div className="flex-1 flex flex-col min-h-[calc(100vh-2rem)] min-w-0">
                {/* Header sticky bar */}
                <Navbar />

                {/* Main active page viewport */}
                <main className="flex-1 px-4 md:px-6 pt-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/country/:cca3" element={<CountryDetails />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Footer and credit markings */}
                <Footer />
              </div>

            </div>
          </div>

          {/* Toast Notification Container */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 border bg-white text-slate-800 text-xs font-bold rounded-xl shadow-xl',
              duration: 3500,
            }}
          />
        </HashRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
