var construct = require('../lib/classes').construct;

// Dummy class
function Dummy() {}

// Person
function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.name = function() {
  return this.first + ' ' + this.last;
};

// Actual tests
describe('classes.construct', function() {
  
  it('should work correctly with no arguments', function() {
    construct(Dummy).should.be.an.instanceof(Dummy);
  });
  
  it('should work correctly with arguments', function() {
    var john = construct(Person, 'John', 'Doe');
    john.should.be.an.instanceof(Person);
    john.name().should.be.equal('John Doe');
  });
    
});