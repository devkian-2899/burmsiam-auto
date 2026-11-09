export function readPhoto(file, maxEdge) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("Choose a photo."));
      return;
    }
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const longest = Math.max(image.width, image.height) || 1;
      const scale = Math.min(1, maxEdge / longest);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const webp = canvas.toDataURL("image/webp", 0.82);
      const photo = webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/png");
      if (photo.length > 2_500_000) {
        reject(new Error("That photo is too large. Choose a smaller one."));
        return;
      }
      resolve(photo);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That photo could not be read."));
    };
    image.src = url;
  });
}
