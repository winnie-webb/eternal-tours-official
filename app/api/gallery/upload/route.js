import multer from "multer";
import fs from "fs";
import path from "path";

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category } = req.body;
    const uploadPath = path.join(process.cwd(), `public/${category}`);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { category } = req.body;
    const uploadPath = path.join(process.cwd(), `public/${category}`);
    const files = fs.readdirSync(uploadPath);
    const imageCount = files.length;
    const extension = path.extname(file.originalname);
    const newFilename = `${category}-${imageCount + 1}${extension}`;
    cb(null, newFilename);
  },
});

// Create Multer instance with the storage configuration
const upload = multer({ storage });

// Named export for the POST method
export const POST = (req) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {}, (error) => {
      if (error) {
        console.error("Upload error:", error);
        return reject(
          new Response(`Upload error: ${error.message}`, { status: 500 })
        );
      }

      const { category, name } = req.body;
      const file = req.file;
      if (!file) {
        console.error("No file uploaded");
        return reject(new Response("No file uploaded", { status: 400 }));
      }

      const productData = {
        name,
        category,
        image: `/${category}/${file.filename}`,
      };

      console.log("Product data:", productData);

      resolve(
        new Response(
          JSON.stringify({
            message: "File uploaded successfully!",
            product: productData,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
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
