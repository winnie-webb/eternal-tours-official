import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // We disable the bodyParser to handle the file manually
  },
};

const uploadDir = path.join(process.cwd(), "public/gallery");

export async function POST(req) {
  // Check if it's a multipart form request
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(JSON.stringify({ error: "Invalid content type" }), {
      status: 400,
    });
  }

  // Get the FormData object from the request
  const formData = await req.formData();

  // Extract the file from FormData
  const file = formData.get("image");
  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  // Convert file into a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create the file path and save the file using `fs`
  const fileName = file.name || "uploaded-image.png"; // Use original name or fallback
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.writeFile(filePath, buffer); // Save the file in the directory

    return new Response(
      JSON.stringify({ message: "File uploaded", fileName }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error writing file:", err);
    return new Response(JSON.stringify({ error: "Error saving file" }), {
      status: 500,
    });
  }
}
