const fs = require('fs');
const path = require('path');
(new require("adm-zip")(
  path.resolve(__dirname,
  `./${process.platform}.zip`)
)).extractAllTo(path.resolve(__dirname), true);
fs.chmodSync(
  path.resolve(
    __dirname,
    `flatc${process.platform === 'win32' ? '.exe' : ''}`
  ),
  0o766
);