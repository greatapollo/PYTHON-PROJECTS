import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  Navigate, 
  useLocation,
  useNavigate 
} from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductView from "./pages/ProductView";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ========== Auth Context ==========
const AuthContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ========== NavLink Component ==========
function NavLink({ to, children, exact }) {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

// ========== Sidebar Component ==========
function Sidebar({ onLogout }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div 
        className="p-6 text-center border-b border-purple-800 cursor-pointer hover:bg-purple-900/30 transition"
        onClick={() => navigate('/dashboard')}
      >
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          EasyFlow
        </div>
        <div className="text-xs text-gray-400 mt-1">Inventory Management</div>
      </div>

      {currentUser && (
        <div className="p-4 border-b border-purple-800 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
              {currentUser.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{currentUser.username}</div>
              <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" exact>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </NavLink>
        
        <NavLink to="/products">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Product List
        </NavLink>
        
        <NavLink to="/add-product">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </NavLink>
      </nav>

      <div className="p-4 border-t border-purple-800">
        <button
          onClick={onLogout}
          className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

// ========== Loading Screen ==========
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white mb-6 mx-auto"></div>
        <div className="text-white text-2xl font-semibold">Loading EasyFlow...</div>
        <div className="text-purple-200 mt-2">Please wait</div>
      </div>
    </div>
  );
}

// Route Guard Component
function RequireAuth({ children }) {
  const { isLoggedIn, currentUser } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, currentUser]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    console.warn('⚠️ [AUTH GUARD] Redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ========== Main App Component ==========
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("currentUser");
        
        console.log('🔄 [AUTH INIT] Checking localStorage...');
        
        if (token && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user && user.username) {
              setIsLoggedIn(true);
              setCurrentUser(user);
              console.log('✅ [AUTH INIT] Loaded user:', user.username);
            } else {
              throw new Error('Invalid user data');
            }
          } catch (e) {
            console.error('❌ [AUTH INIT] Invalid user JSON');
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
          }
        }
      } catch (err) {
        console.error('❌ [AUTH INIT] Error:', err);
        setError("Failed to load session");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      } finally {
        setIsAuthReady(true);
        console.log('✅ [AUTH INIT] Complete. isLoggedIn:', isLoggedIn);
      }
    };

    initAuth();
  }, []);

  // Sync auth state to localStorage
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      try {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        console.log('💾 [AUTH SYNC] Saved user to localStorage');
      } catch (err) {
        console.error('❌ [AUTH SYNC] Error saving:', err);
      }
    }
  }, [isLoggedIn, currentUser]);

  const handleAuthSuccess = (user) => {
    console.log('✅ [AUTH SUCCESS] Setting user:', user);
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    console.log('🚪 [LOGOUT] Clearing auth state');
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = '/login';
  };

  const authValue = {
    isLoggedIn,
    currentUser,
    login: handleAuthSuccess,
    logout: handleLogout
  };

  if (!isAuthReady) {
    console.log('⏳ [APP] Waiting for auth initialization...');
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ [APP] Rendering routes. isLoggedIn:', isLoggedIn);

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleAuthSuccess} />
              )
            } 
          />
          
          <Route 
            path="/register" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register onRegister={handleAuthSuccess} />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <ProtectedLayout onLogout={handleLogout}>
                  <Dashboard />
                </ProtectedLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/products"
            element={
              <RequireAuth>
                <ProtectedLayout onLogout={handleLogout}>
                  <ProductList />
                </ProtectedLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/product/:id"
            element={
              <RequireAuth>
                <ProtectedLayout onLogout={handleLogout}>
                  <ProductView />
                </ProtectedLayout>
              </RequireAuth>
            }
          />
          
          <Route
            path="/add-product"
            element={
              <RequireAuth>
                <ProtectedLayout onLogout={handleLogout}>
                  <AddProduct />
                </ProtectedLayout>
              </RequireAuth>
            }
          />
          
          {/* Redirect root */}
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Catch-all */}
          <Route 
            path="*" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

// ========== Protected Layout Component ==========
function ProtectedLayout({ onLogout, children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
