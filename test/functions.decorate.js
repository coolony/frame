var decorate = require('../lib/functions').decorate;

function dec1(func, arg1, arg2) {
  return (arg1 || 'a') + func(arg1, arg2) + (arg2 || 'f');
}

function dec2(func, arg1, arg2) {
  return (arg1 || 'b') + func(arg1, arg2) + (arg2 || 'e');
}

function foo(arg1, arg2) {
  return (arg1 || 'c') + (arg2 || 'd');
}

// Actual tests
describe('functions.decorate', function() {
  
  var decorated1 = decorate(foo, dec1);
  var decorated2 = decorate(foo, dec1, dec2);
  
  it('should work correctly without arguments', function() {
    decorated1().should.equal('acdf')
    decorated2().should.equal('bacdfe')
  });
  
  it('should work correctly with arguments', function() {
    decorated1('x', 'y').should.equal('xxyy')
    decorated2('y', 'x').should.equal('yyyxxx')
  });
    
});