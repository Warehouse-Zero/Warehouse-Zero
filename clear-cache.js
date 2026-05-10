// 临时脚本，清空后端状态
const fs = require('fs');
const path = './node_modules/.vite/.cache.json';
if (fs.existsSync(path)) {
  console.log('Vite cache exists');
}
