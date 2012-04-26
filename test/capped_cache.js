var CappedCache = require('../lib/capped_cache')
  , should = require('should')
  , runCommonCacheTests = require('./cache/cache.common.js');

runCommonCacheTests(CappedCache);

describe('CappedCache', function() {
  
  it('should have a default size', function() {
    new CappedCache()._size.should.be.above(0);
  });
  
  it('should accept custom size as argument', function() {
    new CappedCache(1337)._size.should.be.equal(1337);
  });
  
  it('should have an empty initial cache', function() {
    var cache = new CappedCache();
    cache._addedItems.should.be.empty;
  });
    
});

describe('CappedCache#cache', function() {
  
  var cache;
  
  beforeEach(function() {
    cache = new CappedCache(2);
  });
    
  it('should cache and cap items correctly', function() {
    cache.cache('foo', 'bar');
    cache.items.should.be.eql({'foo':'bar'});
    cache._addedItems.should.be.eql(['foo']);
    cache.cache('koo', 'woo')
    cache.items.should.be.eql({'foo':'bar', 'koo':'woo'});
    cache._addedItems.should.be.eql(['foo', 'koo']);
    cache.cache('doo', 'yoo')
    cache.items.should.be.eql({'koo':'woo', 'doo':'yoo'});
    cache._addedItems.should.be.eql(['koo', 'doo']);
  });
  
  it('should be able to update correctly', function() {
    cache.cache('foo', 'bar');
    cache.cache('foo', 'loo');
    cache._addedItems.should.be.eql(['foo']);
  });
  
  it('should not want to cache items with undefined key or data', function() {
    cache.cache(undefined, 'foo');
    cache.cache('foo', undefined);
    cache._addedItems.should.be.eql([]);
  });
  
  it('should work with 0 and false items', function() {
    cache.cache(0, false);
    cache.cache(false, 0);
    cache._addedItems.should.be.eql([0, false]);
  });
    
});

describe('CappedCache#dirty', function() {
  
  var cache;
  
  beforeEach(function() {
    cache = new CappedCache(2).cache('foo', 'bar');
  });
  
  it('should dirty everything if called with no argument', function() {
    cache.cache('koo', 'loo').dirty();
    cache._addedItems.should.be.eql([]);
  });
  
  it('should dirty elements as requested', function() {
    cache.dirty('foo');
    cache._addedItems.should.be.eql([]);
  });
  
  it('should work with non existing elements', function() {
    cache.dirty('nonExisting');
    cache._addedItems.should.be.eql(['foo']);
  });
  
  it('should work multiple elements', function() {
    cache.cache('koo', 'loo').dirty('foo', 'koo');
    cache._addedItems.should.be.eql([]);
  });
  
  it('should work multiple elements', function() {
    cache.cache('koo', 'loo').dirty('foo', 'koo');
    cache._addedItems.should.be.eql([]);
  });
    
});

describe('CappedCache.length', function() {
  
  var cache;
  
  beforeEach(function() {
    cache = new CappedCache(2);
  });
  
  it('should give the correct size', function() {
    cache.cache(0, 1);
    cache.length.should.be.equal(1);
    cache.cache(1, 2);
    cache.length.should.be.equal(2);
    cache.cache(1, 3);
    cache.length.should.be.equal(2);
    cache.cache(4, 2);
    cache.length.should.be.equal(2);
    cache.dirty(1);
    cache.length.should.be.equal(1);
    cache.dirty();
    cache.length.should.be.equal(0);
  });
      
});