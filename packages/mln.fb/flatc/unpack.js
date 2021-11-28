const path = require('path');
const AdmZip = require("adm-zip");
(new AdmZip(path.resolve(__dirname, `./${process.platform}.zip`)))
  .extractAllTo(path.resolve(__dirname), true);
