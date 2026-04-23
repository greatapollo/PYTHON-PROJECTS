const QRCode = require("qrcode");

async function generateQRCode(url) {
  return await QRCode.toDataURL(url);
}

module.exports = { generateQRCode };
