var should = require('should');
    
module.exports = function(CacheClass) {

  describe('CacheClass', function() {
    
    it('should be initializable with no argument', function() {
      new CacheClass().should.be.an.instanceof(CacheClass);
    });
    
    it('should have an empty initial cache', function() {
      var cache = new CacheClass();
      cache._cache.should.eql({});
    });
      
  });
  
  describe('CacheClass#cache', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass();
    });
    
    it('should be chainable', function() {
      cache.cache('foo', 'bar').should.be.equal(cache);
    });
    
    it('should cache items correctly', function() {
      cache.cache('foo', 'bar');
      cache.items.should.be.eql({'foo':'bar'});
      cache.cache('koo', 'woo')
      cache.items.should.be.eql({'foo':'bar', 'koo':'woo'});
      cache.cache('doo', 'yoo')
      cache.items.should.be.eql({'foo':'bar','koo':'woo', 'doo':'yoo'});
    });
    
    it('should be able to update correctly', function() {
      cache.cache('foo', 'bar');
      cache.cache('foo', 'loo');
      cache.items.should.be.eql({'foo':'loo'});
    });
    
    it('should not want to cache items with undefined key or data', function() {
      cache.cache(undefined, 'foo');
      cache.cache('foo', undefined)
      cache.items.should.be.eql({});
    });
    
    it('should work with 0 and false items', function() {
      cache.cache(0, false);
      cache.cache(false, 0)
      cache.items.should.be.eql({0:false, false:0});
    });
      
  });
  
  describe('CacheClass#dirty', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass().cache('foo', 'bar');
    });
    
    it('should be chainable', function() {
      cache.dirty().should.be.equal(cache);
    });
    
    it('should dirty everything if called with no argument', function() {
      cache.cache('koo', 'loo').dirty();
      cache.items.should.be.eql({});
    });
    
    it('should dirty elements as requested', function() {
      cache.dirty('foo');
      cache.items.should.be.eql({});
    });
    
    it('should work with non existing elements', function() {
      cache.dirty('nonExisting');
      cache.items.should.be.eql({'foo':'bar'});
    });
    
    it('should work multiple elements', function() {
      cache.cache('koo', 'loo').dirty('foo', 'koo');
      cache.items.should.be.eql({});
    });
    
    it('should work multiple elements', function() {
      cache.cache('koo', 'loo').dirty('foo', 'koo');
      cache.items.should.be.eql({});
    });
      
  });
  
  describe('CacheClass#get', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass().cache('foo', 'bar');
    });
    
    it('should return the key', function() {
      cache.get('foo').should.be.equal('bar');
      cache.cache('foo', 'loo').get('foo').should.be.equal('loo');
    });
    
    it('should return undefined on non existing key', function() {
      should.not.exist(cache.get('notExisting'))
    });
      
  });
  
  describe('CacheClass#getOrFill', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass().cache('foo', 'bar');
    });
    
    it('should be chainable', function() {
      cache.getOrFill('foo', function(){}).should.be.equal(cache);
    });
    
    it('should return the key if existing', function(done) {
      cache.getOrFill(
        'foo',
        function(){
          should.fail('should not be called…');
        },
        function(result){
          result.should.be.equal('bar');
          done();
        }
      );
    });
    
    it('should get it from cache if not', function(done) {
      cache.getOrFill(
        'boo',
        function(callback){
          callback('yoo');
        },
        function(result){
          result.should.be.equal('yoo');
          done();
        }
      );
      cache.length.should.be.equal(2);
    });
      
  });
  
  describe('CacheClass#getOrFillSync', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass().cache('foo', 'bar');
    });
    
    it('should return the key if existing', function() {
      cache.getOrFillSync(
        'foo',
        function(){
          should.fail('should not be called…');
        }
      ).should.be.equal('bar');
    });
    
    it('should get it from cache if not', function() {
      cache.getOrFillSync(
        'boo',
        function(){
          return 'yoo';
        }
      ).should.be.equal('yoo');
      cache.length.should.be.equal(2);
    });
      
  });
  
  describe('CacheClass.length', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass();
    });
    
    it('should be 0 when nothing is cached', function() {
      cache.length.should.be.equal(0);
    });
    
    it('should give the correct size', function() {
      cache.cache(0, 1);
      cache.length.should.be.equal(1);
      cache.cache(1, 2);
      cache.length.should.be.equal(2);
      cache.cache(1, 3);
      cache.length.should.be.equal(2);
      cache.cache(4, 2);
      cache.length.should.be.equal(3);
      cache.dirty(1);
      cache.length.should.be.equal(2);
      cache.dirty();
      cache.length.should.be.equal(0);
    });
        
  });
  
  describe('CacheClass.items', function() {
    
    var cache;
    
    beforeEach(function() {
      cache = new CacheClass();
    });
    
    it('should be empty when nothing is cached', function() {
      cache.items.should.be.eql({});
    });
    
    it('should return actual cache', function() {
      cache.cache('foo', 'bar').items.should.be.eql({'foo':'bar'});
      cache.cache('foo', 'woo').items.should.be.eql({'foo':'woo'});
      cache.cache('loo', 'boo').items.should.be.eql({'foo':'woo', 'loo':'boo'});
      cache.dirty().items.should.be.eql({});
    });
        
  });

}