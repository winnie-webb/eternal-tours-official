import { promises as fs } from "fs";
import path from "path";

// Path to your JSON file
const productsFilePath = path.join(process.cwd(), "data", "products.json");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Get a specific product by id
    try {
      const productsData = await fs.readFile(productsFilePath, "utf-8");
      const products = JSON.parse(productsData);
      const product = products.find((p) => p.id === id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error reading products file" });
    }
  } else if (req.method === "PUT") {
    // Update a specific product by id
    try {
      const updatedProduct = req.body;
      const productsData = await fs.readFile(productsFilePath, "utf-8");
      const products = JSON.parse(productsData);

      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
      }

      products[productIndex] = updatedProduct;

      await fs.writeFile(
        productsFilePath,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
