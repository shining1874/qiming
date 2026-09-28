// tools/make_icons.js · 生成 tabBar 图标（透明底 + 纯色字形）
// 运行：node tools/make_icons.js
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 84, H = 84;

function crc32(buf) {
  let crcTable = [];
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); crcTable[n] = c >>> 0; }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function writePNG(file, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(H * (W * 4 + 1));
  for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; rgba.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, y * W * 4 + W * 4); }
  const idat = zlib.deflateSync(raw);
  const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(file, png);
}

function makeBuffer(drawFn, color) {
  const buf = Buffer.alloc(W * H * 4); // 全透明
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (drawFn(x, y)) {
      const i = (y * W + x) * 4;
      buf[i] = color[0]; buf[i + 1] = color[1]; buf[i + 2] = color[2]; buf[i + 3] = 255;
    }
  }
  return buf;
}
function inCircle(x, y, cx, cy, r) { return (x - cx) ** 2 + (y - cy) ** 2 <= r * r; }
function inRect(x, y, x0, y0, x1, y1) { return x >= x0 && x <= x1 && y >= y0 && y <= y1; }

// 首页：房子
function drawHome(x, y) {
  const cx = W / 2;
  const roofTop = H * 0.16, roofBottom = H * 0.48;
  const bodyTop = roofBottom - 1, bodyBottom = H * 0.84;
  // 屋顶三角（顶窄底宽，带出檐）
  if (y >= roofTop && y < roofBottom) {
    const t = (y - roofTop) / (roofBottom - roofTop);
    const half = W * 0.10 + W * 0.30 * t;
    if (Math.abs(x - cx) <= half) return true;
  }
  // 房身 + 门洞
  if (inRect(x, y, W * 0.28, bodyTop, W * 0.72, bodyBottom)) {
    if (inRect(x, y, W * 0.44, H * 0.60, W * 0.56, bodyBottom)) return false;
    return true;
  }
  return false;
}
// 收藏：五角星
function drawStar(x, y) {
  const cx = W / 2, cy = H / 2, R = W * 0.40, r = W * 0.17;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + i * Math.PI / 5;
    const rad = (i % 2 === 0) ? R : r;
    pts.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad]);
  }
  return pointInPoly(x + 0.5, y + 0.5, pts);
}
function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
// 会员：人像
function drawPerson(x, y) {
  const cx = W / 2;
  if (inCircle(x, y, cx, H * 0.34, H * 0.16)) return true;       // 头
  if (inCircle(x, y, cx, H * 0.86, H * 0.34)) return true;       // 身（露上半）
  if (y > H * 0.80) return false;
  return false;
}

const OFF = [154, 140, 118];   // #9A8C76
const ON = [192, 57, 43];      // #C0392B

const dir = path.join(__dirname, '..', 'images', 'nav');
fs.mkdirSync(dir, { recursive: true });

const shapes = { home: drawHome, star: drawStar, member: drawPerson };
for (const [name, fn] of Object.entries(shapes)) {
  writePNG(path.join(dir, name + '-off.png'), makeBuffer(fn, OFF));
  writePNG(path.join(dir, name + '-on.png'), makeBuffer(fn, ON));
}
console.log('icons written to', dir);
