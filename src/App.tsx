import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ObjectsPage from './pages/ObjectsPage';
import ObjectDetailPage from './pages/ObjectDetailPage';
import CreateObjectPage from './pages/CreateObjectPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { ObjectsProvider } from './context/ObjectsContext';
import PoliceStationsPage from './pages/PoliceStationsPage';
import LostObjectsByMonthPage from './pages/LostObjectsByMonthPage';
import StorePage from './pages/StorePage';
import AddProductPage from './pages/AddProductPage';
import ObjectEditPage from './pages/ObjectEditPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Admin route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
};

// Fondo: más gris en el centro, blanco solo en los bordes laterales y muy sutil, con imagen personalizada
const backgroundStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 120% 80% at 50% 40%, rgba(30,41,59,0.97) 0%, rgba(30,41,59,0.97) 70%, rgba(255,255,255,0.10) 100%),
    linear-gradient(351deg, rgba(4,19,29,0.96) 0%, rgba(4,19,29,0.95) 15%, rgba(108,172,228,0.10) 60%, rgba(255,255,255,0.05) 100%),
    url('/bicos.png') center center/contain no-repeat
  `,
  minHeight: '100vh',
  minWidth: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 0,
  width: '100vw',
  height: '100vh',
};

// New component for Providers and routes
function AppRoutes() {
  // Now you can use useNavigate here
  

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
    >
      <ObjectsProvider>
        {/* Fondo blanco */}
        <div style={backgroundStyle}></div>
        <div className="flex flex-col min-h-screen text-white relative" style={{ position: 'relative', zIndex: 1 }}>
          {/* Content */}
          <div className="relative z-10">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/objetos" element={<ObjectsPage />} />
                <Route path="/objetos/:id" element={<ObjectDetailPage />} />
                <Route path="/sign-in/*" element={
                  <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 glass-card p-8 hover-glow">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold gradient-text">Bienvenido </h2>
                        <p className="mt-2 text-sm text-gray-300">
                          Inicia sesión para acceder a tu cuenta
                        </p>
                      </div>
                      <SignIn routing="path" path="/sign-in" />
                    </div>
                  </div>
                } />
                <Route path="/sign-up/*" element={
                  <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 glass-card p-8 hover-glow">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold gradient-text">Únete a Vigo</h2>
                        <p className="mt-2 text-sm text-gray-300">
                          Crea una cuenta para empezar
                        </p>
                      </div>
                      <SignUp routing="path" path="/sign-up" />
                    </div>
                  </div>
                } />
                <Route path="/comisarias" element={<PoliceStationsPage />} />
                <Route path="/objetos-perdidos/:monthId" element={<LostObjectsByMonthPage />} />
                <Route 
                  path="/publicar" 
                  element={
                    <>
                      <SignedIn>
                        <CreateObjectPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route 
                  path="/perfil" 
                  element={
                    <>
                      <SignedIn>
                        <ProfilePage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route
                  path="/perfil/:id"
                  element={
                    <>
                      <SignedIn>
                        <ProfilePage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route path="/tienda" element={<StorePage />} />
                <Route
                  path="/tienda/nuevo"
                  element={
                    <>
                      <SignedIn>
                        <AdminRoute>
                          <AddProductPage />
                        </AdminRoute>
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route path="/objetos/editar/:id" element={<ObjectEditPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
    
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </div>
        </div>
      </ObjectsProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;