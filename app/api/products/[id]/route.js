import { promises as fs } from "fs";
import path from "path";

// Path to your products.json file
const productsFilePath = path.join(
  process.cwd(),
  "app",
  "data",
  "products.json"
);

// Named export for the GET method
export async function GET(req, { params }) {
  const { id } = params;
  console.log(productsFilePath);
  try {
    const productsData = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(productsData);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching product" }), {
      status: 500,
    });
  }
}

// Named export for the PUT method
export async function PUT(req, { params }) {
  const { id } = params;
  console.log(id, productsFilePath);
  try {
    const productsData = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(productsData);
    const updatedProduct = await req.json();

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    products[productIndex] = updatedProduct;
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating product" }), {
      status: 500,
    });
  }
  //   return new Response(JSON.stringify({ message: "Hello" }));
}
