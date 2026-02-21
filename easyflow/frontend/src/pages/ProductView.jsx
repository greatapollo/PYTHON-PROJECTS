import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, updateProduct, deleteProduct } from "../api/api";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setName(data.name);
        setBatch(data.batch_number);
        if (data.image) setImageUrl(data.image);
      })
      .catch(console.error);
  }, [id]);

  const handleEdit = () => {
    if (!window.confirm("Save changes to this product?")) return;

    updateProduct(id, { name, batch_number: batch })
      .then((updatedProduct) => {
        setProduct(updatedProduct);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    deleteProduct(id)
      .then(() => {
        navigate("/products");
      })
      .catch(console.error);
  };

  if (!product) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6 space-y-4">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Batch Number</label>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Product Image URL (optional)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded"
            />
          )}
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p>
            <span className="font-semibold">Batch:</span> {product.batch_number}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(product.created_at).toLocaleString()}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <Link
              to="/products"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
