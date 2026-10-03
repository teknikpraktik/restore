// Genererar enkla PWA-ikoner (accentfärg med ljus ring). Egen grafik, inga beroenden.
import { deflateSync } from 'node:zlib'
import fs from 'node:fs'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
  return Buffer.concat([len, td, c])
}
function png(size) {
  const bg = [0x3d, 0x6a, 0x5d], fg = [0xf7, 0xf5, 0xf1]
  const raw = Buffer.alloc((size * 3 + 1) * size)
  const cx = size / 2, r1 = size * 0.28, r2 = size * 0.2
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx + 0.5, y - cx + 0.5)
      const col = d <= r1 && d >= r2 ? fg : bg
      raw.set(col, y * (size * 3 + 1) + 1 + x * 3)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ])
}
fs.mkdirSync('public/icons', { recursive: true })
for (const s of [192, 512]) fs.writeFileSync(`public/icons/icon-${s}.png`, png(s))
