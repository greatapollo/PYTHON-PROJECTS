import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;
  const totalPages = Math.ceil(total / limit);

  // Fetch products whenever search, sort, or page changes
  useEffect(() => {
    getAllProducts({ search, sort: sortBy, page, limit })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch(console.error);
  }, [search, sortBy, page]);

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    deleteProduct(id)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotal((t) => t - 1);
        if (products.length === 1 && page > 1) setPage(page - 1);
      })
      .catch(console.error);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Product List</h2>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name or batch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center gap-2">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="batch-asc">Batch (A–Z)</option>
            <option value="batch-desc">Batch (Z–A)</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <Link
                    to={`/product/${p.id}`}
                    className="font-semibold text-blue-500 hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{p.batch_number}</td>
                <td className="px-4 py-2">
                  {new Date(p.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    to={`/product/${p.id}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
