var extend = require('../lib/classes').extend;

// Person
function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.name = function() {
  return this.first + ' ' + this.last;
};

Person.prototype.toString = function() {
  return this.first + ' ' + this.last;
};

// Employee
function Employee(first, last, id) {
  Employee._superclass.call(this, first, last);
  this.id = id;
}
extend(Employee, Person);

Employee.prototype.toString = function() {
  return Employee._superproto.toString.call(this) + ': ' + this.id;
};

// Manager
function Manager(first, last, id, department) {
  Manager._superclass.call(this, first, last, id);
  this.department = department;
}
extend(Manager, Employee);

Manager.prototype.toString = function() {
  return Manager._superproto.toString.call(this) + ': ' + this.department;
};

// Actual tests
describe('classes.extend', function() {
  
  it('should work correctly at the base level', function() {
    var employee = new Employee('John', 'Doe', 5)
    employee.name().should.be.equal('John Doe');
    employee.toString().should.be.equal('John Doe: 5');
  });
  
  it('should work correctly at upper levels', function() {
    var employee = new Manager('Jane', 'Jacobs', 19, 'coffee')
    employee.name().should.be.equal('Jane Jacobs');
    employee.toString().should.be.equal('Jane Jacobs: 19: coffee');
  });
    
});