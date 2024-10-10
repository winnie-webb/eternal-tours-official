import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), "public/gallery");
    const images = await fs.readdir(galleryDir);
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    return new Response(
      JSON.stringify({ error: "Error fetching gallery images" }),
      { status: 500 }
    );
  }
}
