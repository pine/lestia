function Resolver(lestia) {
  this._lestia = lestia;
  this._funcs = [];
}

Resolver.prototype.register = function (func) {
  var id = this._funcs.length;
  
  this._funcs.push(func);
  this._lestia.set(this._name(id), func);
  
  return id;
};

Resolver.prototype.resolve = function (id) {
  return this._lestia.get(this._name(id));
};

Resolver.prototype._name = function (id) {
  return '__anonymous_' + id;
};

module.exports = Resolver;