var _ = require('lodash');

function map (obj, convert) {
  var converted = convert(obj);
  
  if (converted) {
    return converted;
  }
  
  if (_.isArray(obj)) {
    return _.map(obj, function (value) {
      return map(value, convert);
    });
  }
  
  if (_.isPlainObject(obj)) {
    var keys = _.keys(obj);
    
    _.each(keys, function (key) {
      obj[key] = map(obj[key], convert);
    });
    
    return obj;
  }
  
  return obj;
}

module.exports = map;
