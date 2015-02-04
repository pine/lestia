var util = require('util');
var events = require('events');
var _ = require('lodash');

var serialize = require('./serialize');
var deserialize = require('./deserialize');

var Resolver = require('./func/resolver');
var SendFilter = require('./func/send-filter');
var ReceiveFilter = require('./func/receive-filter');

// ---------------------------------------------------------

function Lestia () {
  'use strict';
  
  var self = this;
  
  events.EventEmitter.call(self);
  
  this.on('receive', function (msg) {
    if (_.size(msg) === 2) {
      self._called(msg[0], msg[1]);
    }
    
    else {
      self.emit('error', 'Invalid message format `' + msg + '`');
    }
  });
  
  this._funcs = { };
  this._resolver = new Resolver(this);
  this._filters = {
    send: new SendFilter(this._resolver).filter(),
    receive: new ReceiveFilter(this._resolver).filter()
  };
}

util.inherits(Lestia, events.EventEmitter);

// ---------------------------------------------------------

Lestia.prototype.get = function (name) {
  var self = this;
  
  if (!_.isString(name)) {
    this.emit('error', 'Invalid function name `' + name + '`');
    return function () { };
  }
  
  return function () {
    self._call(name, _.toArray(arguments));
  };
};

Lestia.prototype.set = function(name, func) {
  if (!_.isString(name)) {
    this.emit('error', 'Invalid function name `' + name + '`');
    return;
  }
  
  if (!_.isFunction(func)) {
    this.emit('error', 'Invalid function `' + func + '`');
    return;
  }
  
  this._funcs[name] = func;
};

Lestia.prototype._call = function (name, args) {
  this.emit('log', 'Call the named function `' + name + '`');
  this.emit('send', [ name, serialize(this._filters.send(args)) ]);
};

Lestia.prototype._called = function (name, args) {
  var self = this;
  
  deserialize(args, function (err, args) {
    if (err) {
      self.emit('error', err);
      return;
    }
    
    if (!self._funcs[name]) {
      self.emit('error', 'Can\'t find the named function `' + name + '`');
      return;
    }
    
    self.emit('log', 'Called the named function `' + name + '`');
    self._funcs[name].apply(null, self._filters.receive(args));
  });
};

// ---------------------------------------------------------

module.exports = function() {
  return new Lestia();
};