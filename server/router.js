var urlParser = require('url');
module.exports.parse = function (request) {
  return urlParser.parse(request.url);
}