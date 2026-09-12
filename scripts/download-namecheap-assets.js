const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../apps/web/public/images/namecheap');
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

const NAMECHEAP_ASSETS = [
  { name: 'promo-card.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/promo-card.00bd047838b0328804cecac7222a8e97.svg' },
  { name: 'figma-logo.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/figma-logo.4f051441da007e3f865816e7766648a8.svg' },
  { name: 'imgur-logo.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/imgur-logo.2686e7eefb16d4f1e46b204b578d74f4.svg' },
  { name: 'privacy-logo.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/privacy-logo.9f51d48b9380d84ac656873c33cd53a1.svg' },
  { name: 'buffer-logo.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/buffer-logo.5c629ca8a4925b53d5798fff32fd6b24.svg' },
  { name: 'buy-a-domain.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/buy-a-domain.687c1ba7ac761396bc11e0151ef51c3a.svg' },
  { name: 'find-a-hosting.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/find-a-hosting.eeb44f3d099d4a05b9a9f105efc12d46.svg' },
  { name: 'add-email.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/add-email.29cf403e4bf786cddb6c9da52bc11548.svg' },
  { name: 'security.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/security.2216317a5494176d8008d0a518180ac5.svg' },
  { name: 'boost-performance.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/boost-performance.43950268dc2c215d552d4233f51593cc.svg' },
  { name: 'card-support.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/card-support.76a219827154969af31af4f9f21aee0d.svg' },
  { name: 'card-discover.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/card-discover.df9d05a5e476dc82254d0959cf377f06.svg' },
  { name: 'card-transfer.svg', url: 'https://static.nc-img.com/pp/cms/home-reskinned/images/card-transfer.08e78f9b17ee994aeb67734f279cfb68.svg' },
  { name: 'subscription-section-img.svg', url: 'https://static.nc-img.com/pp/home-page/client/assets/images/subscription-section-img.4217afdc.svg' },
];

async function run() {
  for (const item of NAMECHEAP_ASSETS) {
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
