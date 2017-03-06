/**
 * React Native CLI configuration file
 */
'use strict';

const blacklist = require('react-native/packager/blacklist');

module.exports = {
  getBlacklistRE(platform) {
    return blacklist(platform, [
      /__internal__\/.*/,
    ]);
  },
};
