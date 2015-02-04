var chai = require('chai');

var expect = chai.expect;

var events = require('events');
var serialize = require('../../lib/serialize');
var deserialize = require('../../lib/deserialize');

describe('Unit test for deserialize', function () {
  it('should succeed deserialization', function (done) {
    var obj = { num: 1, str: 'str', ary: [ /regexp/g ] };
    
    deserialize(serialize(obj), function (err, obj2) {
      try {
        expect(err).to.be.null;
        expect(obj2).to.deep.equal(obj);
        
        done();
      }
      
      catch(e) {
        done(e);
      }
    });
  });
  
  it('should fail deserialization', function (done) {
    var obj = { num: 1, str: 'str', ary: [ /regexp/g ] };
    
    deserialize(serialize(obj) + '+++ invalid syntax +++', function (err, obj2) {
      try {
        expect(err).to.not.be.null;
        expect(obj2).to.be.null;
        
        done();
      }
      
      catch(e) {
        done(e);
      }
    });
  });
});