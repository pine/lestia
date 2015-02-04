var mousse = require('mousse');

function deserialize (value, cb) {
  mousse.deserialize(value).then(
    function (obj) { cb(null, obj); },
    function (err) { cb(err, null); }
    );
}

module.exports = deserialize;