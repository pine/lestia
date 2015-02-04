var mousse = require('mousse');

function serialize (value) {
  return mousse.serialize(value);
}

module.exports = serialize;