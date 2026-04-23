import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-md mb-3"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md mb-3 text-gray-500">
          No Image
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-gray-600 mb-1">Batch: {product.batch_number}</p>
      <p className="text-gray-400 text-sm mb-3">
        Created: {new Date(product.created_at).toLocaleString()}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
