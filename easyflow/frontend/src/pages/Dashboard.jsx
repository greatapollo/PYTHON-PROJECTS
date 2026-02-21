import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../api/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📊 [DASHBOARD] Initializing...');
    
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllProducts({ page: 1, limit: 1000 });
        
        console.log('✅ [DASHBOARD] Data loaded:', data);
        
        if (!data || !Array.isArray(data.products)) {
          throw new Error("Invalid data format from server");
        }
        
        setProducts(data.products);
        
        // Get latest 5 products (sort by ID descending)
        const latest = [...data.products]
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 5);
        setLatestProducts(latest);
        
      } catch (err) {
        console.error('❌ [DASHBOARD] Load failed:', err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
          }, 3000);
        } else if (err.code === 'ERR_NETWORK') {
          setError("Cannot connect to server. Please check your internet connection.");
        } else {
          setError(err.message || "Failed to load dashboard data. Please refresh.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-600 mb-6"></div>
        <p className="text-xl text-gray-700 font-medium">Loading your dashboard...</p>
        <p className="text-gray-500 mt-2">Fetching your inventory data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800">Dashboard Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Your inventory at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">Total Products</h2>
              <p className="text-4xl font-bold mt-2">{products.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Add Product CTA */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">Add New Product</h2>
              <p className="mt-1 opacity-90">Expand your inventory</p>
            </div>
            <Link
              to="/add-product"
              className="mt-4 inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform transition hover:scale-105">
          <h2 className="text-lg font-medium opacity-90 mb-4">Quick Actions</h2>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/products" 
                className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                <svg className="w-5 h-5 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>View All Products</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/add-product" 
                className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                <svg className="w-5 h-5 mr-3 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Product</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Latest Products Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg className="w-7 h-7 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Latest Products
          </h2>
        </div>
        
        {latestProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Start building your inventory by adding your first product
            </p>
            <Link
              to="/add-product"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestProducts.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.name || 'Unnamed'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.batch_number || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.created_at 
                        ? new Date(p.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/product/${p.id}`}
                        className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
