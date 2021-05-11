module.exports = function (wallaby) {
  require('fs-extra').ensureDirSync(wallaby.localProjectDir);

  return {
    files: [
      'app.js'
    ],

    tests: [
      'app.spec.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    }
  };

};