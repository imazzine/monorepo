const path = require('path');
(new require("adm-zip")(
  path.resolve(__dirname,
  `./${process.platform}.zip`)
)).extractAllTo(path.resolve(__dirname), true);
