'use strict';

const gs = require('ghostscript4js');

let cmd = '-dEPSFitPage=true -dSetPageSize=false -sDEVICE=eps2write -o C:\\UniServerZ\\www\\visualicons\\pack\\social\\pdf\\avatar.eps -sDEVICE=eps2write C:\\UniServerZ\\www\\visualicons\\pack\\social\\pdf\\avatar.pdf';

let cmd2 = '-o C:\\UniServerZ\\www\\visualicons\\pack\\social\\pdf\\avatar1.eps -sDEVICE=eps2write -c "<</BeginPage{0.24 0.24 scale}>> setpagedevice" -f C:\\UniServerZ\\www\\visualicons\\pack\\social\\pdf\\avatar.eps';

try {
  gs.executeSync(cmd2);
} catch (err) {
  // Handle error
  throw err;
}
