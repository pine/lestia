var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

var events = require('events');
var lestia = require('../../lib/lestia');

describe('Unit test for lestia', function () {
  it('should occur an error because message format is invalid', function (done) {
    var client = lestia();
    var on_error = sinon.spy(function (err) { console.error(err); });
    
    client.on('error', on_error);
    client.emit('receive', '+++ invalid format message +++');
    
    _.delay(function () {
      try {
        expect(on_error).to.have.been.calledOnce;
        done();
      }
      
      catch(e) {
        done(e);
      }
    }, 10);
  });
  
  it('should return empty function because function name isn\'t string', function () {
    var client = lestia();
    var on_error = sinon.spy(function (err) { console.error(err); });
    
    client.on('error', on_error);
    
    expect(client.get(undefined)).to.be.a('function');
    expect(client.get(undefined)()).to.be.undefined;
    
    expect(on_error).to.have.been.callCount(2);
  });
});