var Locator = require('../lib/locator'),
    should = require('should'),
    testA = __dirname + '/support/test_folders/a',
    testB = __dirname + '/support/test_folders/b',
    testC = __dirname + '/support/test_folders/c';

// Dummy cache class   
function DummyCache(foo, bar) {
  this.foo = foo;
  this.bar = bar;
}
DummyCache.prototype.dirty = DummyCache.prototype.cache = DummyCache.prototype.get = function() {}

// Actual tests
describe('Locator', function() {
  
  it('should be initializable with no argument', function() {
    new Locator()._folders.should.be.empty;
  });
  
  it('should be initializable with an empty array as argument', function() {
    new Locator([])._folders.should.be.empty;
  });
  
  it('should be initializable with a folder given as string', function() {
    new Locator(testA)._folders.should.eql([testA]);
  });
  
  it('should be initializable with a folder given as array', function() {
    new Locator([testA])._folders.should.eql([testA]);
  });
  
  it('should be initializable with multiple folders given as array', function() {
    new Locator([testA, testB])._folders.should.eql([testA, testB]);
  });
  
  it('should ignore null values', function() {
    new Locator([null, "", NaN, undefined])._folders.should.be.empty;
    new Locator(null)._folders.should.be.empty;
    new Locator(NaN)._folders.should.be.empty;
    new Locator("")._folders.should.be.empty;
    new Locator(undefined)._folders.should.be.empty;
  });
  
  it('should ignore duplicates', function() {
    new Locator([testA, testA])._folders.should.eql([testA]);
  });
  
  it('should strip trailing slashes from paths', function() {
    new Locator(testA + '/')._folders.should.eql([testA]);
    new Locator([testA + '/'])._folders.should.eql([testA]);
  });
  
  it('should accept and honor custom cache handler', function() {
    new Locator([testA], {cacheClass: DummyCache})._cache.should.be.instanceof(DummyCache);
  });
  
  it('should correctly pass options to cache handler', function() {
    var locator = new Locator([testA], {cacheClass: DummyCache, cacheOptions: [1337, 69]})
    locator._cache.foo.should.be.equal(1337);
    locator._cache.bar.should.be.equal(69);
  });
  
});

describe('Locator#addFolders', function() {

  var locator;
  
  beforeEach(function() {
    locator = new Locator();
  });
  
  it('should be chainable', function() {
    locator.addFolders().should.equal(locator);
  });
  
  it('should be callable with no argument', function() {
    locator.addFolders()._folders.should.be.empty;
  });
  
  it('should be initializable with an empty array as argument', function() {
    locator.addFolders([])._folders.should.be.empty;
  });
  
  it('should be initializable with a folder given as string', function() {
    locator.addFolders(testA)._folders.should.eql([testA]);
  });
  
  it('should be initializable with a folder given as array', function() {
    locator.addFolders([testA])._folders.should.eql([testA]);
  });
  
  it('should be initializable with multiple folders given as array', function() {
    locator.addFolders([testA, testB])._folders.should.eql([testA, testB]);
  });
  
  it('should ignore null values', function() {
    locator.addFolders([null, "", NaN, undefined])._folders.should.be.empty;
    locator.addFolders(null)._folders.should.be.empty;
    locator.addFolders(NaN)._folders.should.be.empty;
    locator.addFolders("")._folders.should.be.empty;
    locator.addFolders(undefined)._folders.should.be.empty;
  });
  
  it('should ignore duplicates', function() {
    locator.addFolders([testA, testA])._folders.should.eql([testA]);
  });
  
  it('should prevent duplicates from being added', function() {
    locator.addFolders(testA).addFolders(testA)._folders.should.eql([testA]);
  });
  
  it('should strip trailing slashes from paths', function() {
    locator.addFolders(testA + '/')._folders.should.eql([testA]);
    locator.addFolders([testB + '/'])._folders.should.eql([testA, testB]);
  });
  
});

describe('Locator#clearFolders', function() {

  var locator;
  
  beforeEach(function() {
    locator = new Locator();
  });
  
  it('should be chainable', function() {
    locator.clearFolders().should.equal(locator);
  });
  
  it('should be callable with an empty folder list', function() {
    locator.clearFolders()._folders.should.be.empty;
  });
  
  it('should clear folders', function() {
    locator.addFolders([testA, testB, testC]).clearFolders()._folders.should.be.empty;
  });
  
});

describe('Locator#removeFolders', function() {

  var locator;
  
  beforeEach(function() {
    locator = new Locator([testA, testB, testC]);
  });
  
  it('should be chainable', function() {
    locator.removeFolders().should.equal(locator);
  });
  
  it('should be callable with no arguments', function() {
    locator.removeFolders()._folders.should.eql([testA, testB, testC]);
  });
  
  it('should be callable with an empty array as argument', function() {
    locator.removeFolders([])._folders.should.eql([testA, testB, testC]);
  });
  
  it('should be callable with a string as argument', function() {
    locator.removeFolders(testA)._folders.should.eql([testB, testC]);
  });
  
  it('should be callable with an array as argument', function() {
    locator.removeFolders([testA])._folders.should.eql([testB, testC]);
  });
  
  it('should be able to remove multiple arguments', function() {
    locator.removeFolders([testA, testC])._folders.should.eql([testB]);
  });
  
  it('should work with items not in folder list', function() {
    locator.removeFolders([null, 'bar', testA, NaN, undefined, testC, 'foo'])._folders.should.eql([testB]);
    locator.removeFolders('foo')._folders.should.eql([testB]);
  });
  
});

describe('Locator#locate', function() {

  var locator = new Locator([testA, testB, testC], {cache: false});
  
  it('should be chainable', function() {
    locator.locate('foo').should.equal(locator);
  });
  
  it('should work for non-existing files', function(done) {
    locator.locate('notExisting', function(result){
      result.should.be.empty;
      done();
    });
  });
  
  it('should locate files', function(done) {
    locator.locate('foo/hello.test', function(result){
      result.should.eql([testA + '/foo/hello.test', testB + '/foo/hello.test']);
      done();
    });
  });
  
  it('should locate folders', function(done) {
    locator.locate('loo', function(result){
      result.should.eql([testC + '/loo']);
      done();
    });
  });
  
});

describe('Locator#locateOne', function() {

  var locator = new Locator([testA, testB, testC], {cache: false});
  
  it('should be chainable', function() {
    locator.locateOne('foo').should.equal(locator);
  });
  
  it('should work for non-existing files', function(done) {
    locator.locateOne('notExisting', function(result){
      should.not.exist(result);
      done();
    });
  });
  
  it('should locate files', function(done) {
    locator.locateOne('foo/hello.test', function(result){
      result.should.eql(testA + '/foo/hello.test');
      done();
    });
  });
  
  it('should locate folders', function(done) {
    locator.locateOne('loo', function(result){
      result.should.eql(testC + '/loo');
      done();
    });
  });
  
});

describe('Locator#locateSync', function() {

  var locator = new Locator([testA, testB, testC], {cache: false});
  
  it('should work for non-existing files', function() {
    locator.locateSync('notExisting').should.be.empty;
  });
  
  it('should locate files', function() {
    locator.locateSync('foo/hello.test').should.eql([testA + '/foo/hello.test', testB + '/foo/hello.test']);
  });
  
  it('should locate folders', function() {
    locator.locateSync('loo').should.eql([testC + '/loo']);
  });
  
});

describe('Locator#locateOneSync', function() {

  var locator = new Locator([testA, testB, testC], {cache: false});
  
  it('should work for non-existing files', function() {
    should.not.exist(locator.locateOneSync('notExisting'));
  });
  
  it('should locate files', function() {
    locator.locateOneSync('foo/hello.test').should.eql(testA + '/foo/hello.test');
  });
  
  it('should locate folders', function() {
    locator.locateOneSync('loo').should.eql(testC + '/loo');
  });
  
});

describe('cache', function() {

  var locator = new Locator([testA, testB, testC], {cache: true});
  
  it('should be enabled by default', function() {
    new Locator()._options.cache.should.be.true;
  });
  
  it('should correctly cache results with locate', function(done) {
    locator.locate('loo', function(result){
      locator._cache.get('loo').should.eql(result);
      done();
    })
  });
  
  it('should correctly cache results with locateSync', function() {
    var result = locator.locateSync('loo')
    locator._cache.get('loo').should.eql(result);
  });
  
  it('should correctly cache results with locateOne', function(done) {
    locator.locateOne('loo', function(result){
      locator._cache.get('loo').should.eql([result]);
      done();
    })
  });
  
  it('should correctly cache results with locateOneSync', function() {
    var result = locator.locateOneSync('loo');
    locator._cache.get('loo').should.eql([result]);
  });
  
  it('should correctly wipe cache on addFolders', function() {
    locator.locate('woo');
    locator.addFolders('foo')._cache.items.should.eql({});
  });
  
  it('should correctly wipe cache on removeFolders', function() {
    locator.locate('woo');
    locator.removeFolders('foo')._cache.items.should.eql({});
  });
  
  it('should correctly wipe cache on clearFolders', function() {
    locator.locate('woo');
    locator.clearFolders()._cache.items.should.eql({});
  });
  
  it('should return cache on locate', function(done) {
    locator._cache.cache('foo', ['boo'])
    locator.locate('foo', function(result){
      result.should.eql(['boo']);
      done();
    })
  });
  
  it('should return cache on locateOne', function(done) {
    locator._cache.cache('foo', ['boo'])
    locator.locateOne('foo', function(result){
      result.should.eql('boo');
      done();
    })
  });
  
  it('should return cache on locateOne', function(done) {
    locator._cache.cache('foo', ['boo'])
    locator.locateOne('foo', function(result){
      result.should.eql('boo');
      done();
    })
  });
  
  it('should return cache on locateSync', function() {
    locator._cache.cache('foo', ['boo'])
    locator.locateSync('foo').should.eql(['boo']);
  });
  
  it('should return cache on locateOneSync', function() {
    locator._cache.cache('foo', ['boo'])
    locator.locateOneSync('foo').should.eql('boo');
  });
  
});