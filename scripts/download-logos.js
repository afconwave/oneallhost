const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../apps/web/public/images/payments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const LOGOS = [
  { name: 'orange-money.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Logo_Orange_Money.svg' },
  { name: 'bitcoin.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg' },
  { name: 'ethereum.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' },
  { name: 'visa.svg', url: 'https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/visa.svg' },
  { name: 'mastercard.svg', url: 'https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/mastercard.svg' },
  { name: 'tether.svg', url: 'https://raw.githubusercontent.com/spothit/cryptocurrency-icons/master/svg/color/usdt.svg' },
];

async function run() {
  for (const item of LOGOS) {
    const dest = path.join(dir, item.name);
    try {
      await download(item.url, dest);
      console.log(`Downloaded ${item.name}`);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

run();
