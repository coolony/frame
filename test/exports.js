var core = require('../');

describe('exports', function() {
  
  it('should expose Locator', function() {
    core.should.have.property('Locator');
  });
  
  it('should expose asyncForEach', function() {
    core.should.have.property('asyncForEach');
  });
  
  it('should expose Cache', function() {
    core.should.have.property('Cache');
  });
  
  it('should expose CappedCache', function() {
    core.should.have.property('CappedCache');
  });
  
  it('should expose class', function() {
    core.should.have.property('classes');
  });
  
  it('should expose class.extend', function() {
    core.classes.should.have.property('extend');
  });
  
  it('should expose class.construct', function() {
    core.classes.should.have.property('construct');
  });
  
  it('should expose functions', function() {
    core.should.have.property('functions');
  });
  
  it('should expose functions.decorate,', function() {
    core.functions.should.have.property('decorate');
  });
  
   it('should expose files', function() {
    core.should.have.property('files');
  });
  
  it('should expose files.requireDir', function() {
    core.files.should.have.property('requireDir');
  });
  
});