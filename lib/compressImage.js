// Browser-only: shrink a photo to a WebP data URL small enough for the
// Firestore-backed image store (/api/images caps uploads at 700 KB).
const TARGET_BYTES = 450 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file isn't an image the browser can read"));
    };
    img.src = url;
  });
}

function dataUrlBytes(dataUrl) {
  return Math.ceil(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);
}

export async function compressImage(file, { maxSide = 1600 } = {}) {
  const img = await loadImage(file);
  let side = maxSide;
  let quality = 0.85;

  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

    let dataUrl = canvas.toDataURL("image/webp", quality);
    // Safari before 16 can't encode WebP and silently returns PNG
    if (!dataUrl.startsWith("data:image/webp")) {
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    if (dataUrlBytes(dataUrl) <= TARGET_BYTES) return dataUrl;

    // Too big: lower quality first, then resolution
    if (quality > 0.6) quality -= 0.1;
    else side = Math.round(side * 0.8);
  }
  throw new Error("Couldn't shrink that image enough — try a smaller photo");
}

// Compress, upload, and return the stored image's url.
export async function uploadImage(file) {
  const dataUrl = await compressImage(file);
  const res = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Upload failed (${res.status})`);
  return body.url;
}
