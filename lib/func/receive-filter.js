var _ = require('lodash');
var map = require('./map');

function ReceiveFilter(resolver) {
  this._resolver = resolver;
}

ReceiveFilter.prototype.filter = function () {
  var self = this;
  
  return function (obj) {
    return map(obj, _.bind(self._convert, self));
  };
};

ReceiveFilter.prototype._convert = function (obj) {
  if (_.isArray(obj) && _.size(obj) === 2) {
    if (obj[0] === '[object Function]' && _.isNumber(obj[1])) {
      return this._resolver.resolve(obj[1]);
    }
  }
  
  return null;
};

module.exports = ReceiveFilter;