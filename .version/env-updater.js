const regex = /(APP_VERSION=)([\d\.]+(-release|-rc(\.\d+)?)?)/;
module.exports.readVersion = function (contents) {
  let version;
  try {
    version = contents.match(regex)[2];
  } catch (e) {
    console.error(e);
    throw e;
  }
  return version;
};

module.exports.writeVersion = function (contents, version) {
  return contents.replace(regex, '$1' + version);
};
