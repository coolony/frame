var requireDir = require('../lib/files').requireDir;

var folder = __dirname + '/support/require'
var emptyFolder = __dirname + '/support/require_empty'

// Actual tests
describe('files.requireDir', function() {
  
  it('should work correctly without trailing slash', function() {
    requireDir(folder).should.eql({bar: 'hello', foo: 'hey'});
  });
  
  it('should work correctly with the trailing slash', function() {
    requireDir(folder + '/').should.eql({bar: 'hello', foo: 'hey'});
  });
  
  it('should work with empty folders', function() {
    requireDir(emptyFolder).should.eql({});
  });
  
  it('should throw an error for non existing folders', function() {
    (function(){
      requireDir(emptyFolder + 'foo');
    }).should.throw();
  });
    
});