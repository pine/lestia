Lestia
------
[![npm version](https://badge.fury.io/js/lestia.svg)](http://badge.fury.io/js/lestia)
[![Build Status](https://travis-ci.org/pine613/lestia.svg?branch=master)](https://travis-ci.org/pine613/lestia)
[![Coverage Status](https://coveralls.io/repos/pine613/lestia/badge.svg)](https://coveralls.io/r/pine613/lestia)
[![Dependency Status](https://david-dm.org/pine613/lestia.svg)](https://david-dm.org/pine613/lestia)
[![devDependency Status](https://david-dm.org/pine613/lestia/dev-status.svg)](https://david-dm.org/pine613/lestia#info=devDependencies)

Lestia is a library of Message-based RPC that can do callback.

## Get started

```
$ npm install lestia --save
```


## Tests

```
$ npm install
$ npm test
```

## References
### Create new RPC client

```js
var client = lestia();

```

### Set message handler

```
client.on('send', function (msg) {
  // Send message code
  SomeMessageAPI.send(msg);
});

// Receive message code
SomeMessageAPI.addListener('receive', function (msg) {
  client.emit('receive', msg);
});

```

### Get RPC function

```js
var func = client.get('function_name');
func('arg1', [ 1, 2, 3 ]);
```

### Set RPC function

```js
client.set('function_name', function (arg1, arg2) {
  // Called by remote
});

```

### Log and Error message handling

```js
client.on('error', function (err) {
  console.error(err);
});

client.on('log', function (log) {
  console.log(log);
});
```

## License
MIT License