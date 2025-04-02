import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrls = [
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPnga0744889b1a94d50d16cf29724c3c136ba51746d38a3fe18c7ad99db603258ac',
    filename: 'title-bg.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2924c031b60e4918bc612d841661926b2544488675c784c7d99d031e4d0f5030',
    filename: 'main-bg.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng07d6bbc8c702a47e512d26efb3f6d6389e4418454e1e8dfdec55ba9ea88c6864',
    filename: 'timer-bg.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng33c00868ef8e0bc77f337d13f630021a4e7b6e205c94a208d3d20a5b4fc2596b',
    filename: 'twitter-icon.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng5328c3039afdb70d899be647e38f9ebb620903af75b6ff4cda0dd7d12827249f',
    filename: 'telegram-icon.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng90d634f4e661e7ec52df0ab95eb718e76fc7267ea600cbafc12aa714cc90b63b',
    filename: 'divider.png'
  },
  {
    url: 'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng63586989f94b144246fc88d7c97e98f372e966147137f76cdef11f46b833da4c',
    filename: 'leaderboard-bg.png'
  }
];

// 确保目录存在
const dir = path.join(__dirname, 'public', 'assets', 'lanhu');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

// 下载图片
imageUrls.forEach(item => {
  const file = fs.createWriteStream(path.join(dir, item.filename));
  https.get(item.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${item.filename}`);
    });
  }).on('error', err => {
    fs.unlink(path.join(dir, item.filename), () => {}); 
    console.error(`Error downloading ${item.url}: ${err.message}`);
  });
});