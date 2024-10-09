import multer from "multer";
import fs from "fs";
import path from "path";

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category } = req.body;
    const uploadPath = path.join(process.cwd(), `public/${category}`); // Create the category folder if it doesn't exist

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { category } = req.body; // Path to the category folder

    const uploadPath = path.join(process.cwd(), `public/${category}`); // Count the number of files in the directory to create a new unique filename

    const files = fs.readdirSync(uploadPath);
    const imageCount = files.length; // Extract the file extension (e.g., .jpg, .png)

    const extension = path.extname(file.originalname); // Create the new filename (e.g., 'category-1.jpg', 'category-2.jpg', etc.)

    const newFilename = `${category}-${imageCount + 1}${extension}`;

    cb(null, newFilename);
  },
});

// Create Multer instance with the storage configuration
const upload = multer({ storage: storage });

// Named export for the POST method
export const POST = (req) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {}, (error) => {
      if (error) {
        console.error("Upload error:", error);
        return reject(
          new Response(`Upload error: ${error.message}`, { status: 500 })
        ); // Changed to 500
      }

      const { category, name } = req.body;
      const file = req.file;
      console.log(req);
      if (!file) {
        console.error("No file uploaded");
        return reject(new Response("No file uploaded", { status: 400 }));
      } // The image was successfully uploaded and renamed

      const productData = {
        name,
        category,
        image: `/${category}/${file.filename}`, // Path to the uploaded file
      }; // Simulate saving to the database or handling the uploaded data

      console.log("Product data:", productData); // Send response back to the client

      resolve(
        new Response(
          JSON.stringify({
            message: "File uploaded successfully!",
            product: productData,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      ); // Added content type
    });
  });
};

// Handle other HTTP methods
export const OPTIONS = () => {
  return new Response(null, { status: 204 });
};

export const GET = () => {
  return new Response("Method not allowed", { status: 405 });
};
