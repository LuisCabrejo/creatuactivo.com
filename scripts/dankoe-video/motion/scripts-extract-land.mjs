import sharp from "sharp";
import { writeFileSync } from "fs";
// océano = claro (specular), tierra = oscuro
const W = 2048, H = 1024;
const { data } = await sharp("assets/earth_mask.jpg").greyscale().raw().toBuffer({ resolveWithObject: true });
const pts = [];
const stepLat = 2.4, stepLon = 2.4;
for (let lat = -78; lat <= 80; lat += stepLat) {
  for (let lon = -180; lon < 180; lon += stepLon) {
    const px = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W));
    const py = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H));
    const b = data[py * W + px];
    if (b < 110) { // tierra
      const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
      // x=cos(la)cos(lo), y=sin(la), z=cos(la)sin(lo)
      pts.push([
        +(Math.cos(la) * Math.cos(lo)).toFixed(4),
        +(Math.sin(la)).toFixed(4),
        +(Math.cos(la) * Math.sin(lo)).toFixed(4),
      ]);
    }
  }
}
writeFileSync("src/landDots.json", JSON.stringify(pts));
console.log("land dots:", pts.length);
