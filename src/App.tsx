import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';
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
import { useUser } from '@clerk/clerk-react';

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

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ObjectsProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            
            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
            </div>

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
                      <div className="max-w-md w-full space-y-8 glass-card p-8">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold gradient-text">Bienvenido a Vigo</h2>
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
                      <div className="max-w-md w-full space-y-8 glass-card p-8">
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
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
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
        </Router>
      </ObjectsProvider>
    </ClerkProvider>
  );
}

export default App;