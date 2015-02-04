var _ = require('lodash');
var map = require('./map');

function SendFilter(resolver) {
  this._resolver = resolver;
}

SendFilter.prototype.filter = function () {
  var self = this;
  
  return function (obj) {
    return map(obj, _.bind(self._convert, self));
  };
};

SendFilter.prototype._convert = function (obj) {
  if (_.isFunction(obj)) {
    return [ '[object Function]', this._resolver.register(obj) ];
  }
  
  return null;
};

module.exports = SendFilter;