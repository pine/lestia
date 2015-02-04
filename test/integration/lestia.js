var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

var events = require('events');
var lestia = require('../../');

describe('Integration test for lestia', function () {
  var pipe;
  var client1, client2;
  
  beforeEach(function() {
    pipe = new events.EventEmitter();
    
    client1 = lestia();
    client2 = lestia();
    
    pipe.on('to_client1', function (msg) {
      client1.emit('receive', msg);
    });
    
    pipe.on('to_client2', function (msg) {
      client2.emit('receive', msg);
    });
    
    client1.on('send', function (msg) {
      pipe.emit('to_client2', msg);
    });
    
    client1.on('log', function (log) {
      console.log('Log:', log);
    });
    
    client1.on('error', function (err) {
      console.error('Err:', err);
    });
    
    client2.on('send', function (msg) {
      pipe.emit('to_client1', msg);
    });
    
    client2.on('log', function (log) {
      console.log('Log:', log);
    });
    
    client2.on('error', function (err) {
      console.error('Err:', err);
    });
  });
  
  it('should be ok', function () {
    expect(client1).to.be.ok;
    expect(client2).to.be.ok;
  });
  
  it('should return function', function () {
    var on_error = sinon.spy();
    client1.on('error', on_error);
    
    expect(client1.get('test')).to.be.a('function');
    expect(on_error).to.not.have.been.called;
  });
  
  it('should not return function', function () {
    var on_error = sinon.spy();
    client1.on('error', on_error);
    
    expect(client1.get(undefined)).to.be.a('function');
    expect(client1.get(null)).to.be.a('function');
    
    expect(on_error).to.have.been.callCount(2);
  });
  
  it('should not any occur errors', function () {
    var on_error = sinon.spy();
    var fun = sinon.spy();
    
    client2.on('error', on_error);
    client2.set('test', fun);
    
    expect(on_error).to.not.have.been.called;
    expect(fun).to.not.have.been.called;
  });
  
  it('should some occur errors because name is not a string', function () {
    var on_error = sinon.spy();
    var fun = sinon.spy();
    
    client2.on('error', on_error);
    
    client2.set(undefined, fun);
    client2.set(null, fun);
    client2.set(true, fun);
    client2.set(false, fun);
    
    expect(on_error).to.have.been.callCount(4);
    expect(fun).to.not.have.been.called;
  });
  
  it('should some occur errors because function is invalid', function () {
    var on_error = sinon.spy();
    client2.on('error', on_error);

    client2.set('test', undefined);
    client2.set('test', null);
    client2.set('test', true);
    client2.set('test', false);

    expect(on_error).to.have.been.callCount(4);
  });
  
  it('should some occur errors because function is not found', function (done) {
    var on_error = sinon.spy();
    
    client2.on('error', on_error);
    
    var fun_rpc = client1.get('invalid_function_name');
    fun_rpc();
    
    _.defer(function () {
      try {
        expect(on_error).to.have.been.calledOnce;
        done();
      }
      
      catch (e) {
        done(e);
      }
    }, 10);
  });
  
  it('should have been called', function (done) {
    var on_error1 = sinon.spy();
    var on_error2 = sinon.spy();
    var fun_impl = sinon.spy();
    
    client1.on('error', on_error1);
    client2.on('error', on_error2);
    
    client1.set('test', fun_impl);
    var fun_rpc = client2.get('test');
    
    expect(fun_rpc).to.be.a('function');
    
    fun_rpc();
    
    _.defer(function() {
      try {
        expect(on_error1).to.not.have.been.called;
        expect(on_error2).to.not.have.been.called;
        expect(fun_impl).to.have.been.calledOnce;
        done();
      }
      
      catch (e) {
        done(e);
      }
    });
  });
  
  it('should have been called with args', function (done) {
    var on_error1 = sinon.spy();
    var on_error2 = sinon.spy();
    var fun_impl = sinon.spy();
    
    var args = {
      num: 1,
      str: 'str',
      ary: [
        null, true, false, [ /abc/g ]
      ]
    };
    
    client1.on('error', on_error1);
    client2.on('error', on_error2);
    
    client1.set('test', fun_impl);
    var fun_rpc = client2.get('test');
    
    expect(fun_rpc).to.be.a('function');
    
    fun_rpc(args);
    
    _.delay(function() {
      try {
        expect(on_error1).to.not.have.been.called;
        expect(on_error2).to.not.have.been.called;
        expect(fun_impl).to.have.been.calledWith(args);
        done();
      }
      
      catch (e) {
        done(e);
      }
    }, 10);
  });
  
  it('should have been called with callback', function (done) {
    var on_error1 = sinon.spy();
    var on_error2 = sinon.spy();
    
    var fun_impl = sinon.spy(function (cb) {
      cb(200, 'ok');
    });
    
    var fun_cb = sinon.spy();
    
    client1.on('error', on_error1);
    client2.on('error', on_error2);
    
    client1.set('test', fun_impl);
    var fun_rpc = client2.get('test');
    
    expect(fun_rpc).to.be.a('function');
    
    fun_rpc(fun_cb);
    fun_rpc(fun_cb);
    
    _.delay(function() {
      try {
        expect(on_error1).to.not.have.been.called;
        expect(on_error2).to.not.have.been.called;
        expect(fun_impl).to.have.been.calledTwice;
        expect(fun_cb).to.always.have.been.calledWith(200, 'ok');
        done();
      }
      
      catch (e) {
        done(e);
      }
    }, 10);
  });
  
  it('should occur some errors because message format is invalid', function (done) {
    // Destroy message format
    pipe.removeAllListeners('to_client2');
    pipe.on('to_client2', function (msg) {
      msg[1] += '+++ invalid message +++';
      client2.emit('receive', msg);
    });
    
    var on_error1 = sinon.spy();
    var on_error2 = sinon.spy();
    
    client1.on('error', on_error1);
    client2.on('error', on_error2);
    
    var fun_impl = sinon.spy();
    client2.set('test', fun_impl);
    
    var fun_rpc = client1.get('test');
    
    fun_rpc();
    
    _.delay(function () {
      try {
        expect(on_error1).to.not.have.been.called;
        expect(on_error2).to.have.been.calledOnce;
        expect(fun_impl).to.not.have.been.called;
        
        done();
      }
      
      catch (e) {
        done(e);
      }
    }, 10);
  });
});
