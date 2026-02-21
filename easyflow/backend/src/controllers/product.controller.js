const { v4: uuidv4 } = require("uuid");
const products = require("../models/product.model");
const { generateQRCode } = require("../utils/qr.util");

exports.createProduct = async (req, res) => {
  const { name, batch_number } = req.body;

  if (!name || !batch_number) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const id = uuidv4();
  const productUrl = `http://localhost:5173/product/${id}`;
  const qrCode = await generateQRCode(productUrl);

  const product = {
    id,
    name,
    batch_number,
    createdAt: new Date(),
    qrCode,
  };

  products.push(product);

  res.status(201).json(product);
};

exports.getProductById = (req, res) => {
  const { id } = req.params;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
};
