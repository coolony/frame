var asyncForEach = require('../lib/async_foreach');

describe('asyncForEach', function() {

  it('should call items in order', function(done) {
    var call = 0,
        array = [0, 1, 2, 3];
        
    asyncForEach(
      array,
      function(item, next){
        item.should.eql(call);
        call++;
        next();
      },
      function(){
        call.should.eql(array.length);
        done();
      }
    )
  });
  
  it('should break when requested', function(done) {
    var call = 0,
        array = [0, 1, 2, 3];
        
    asyncForEach(
      array,
      function(item, next){
        if(call == 1)
          next(true);
        else
          next();
          call++;
      },
      function(){
        call.should.eql(1);
        done();
      }
    )
  });
  
  it('should call callback', function(done) {
    asyncForEach(
      [0, 1, 2, 3],
      function(item, next){
        next();
      },
      done
    )
  });
  
  it('should call function once per item', function(done) {
    var calls = 0;
    asyncForEach(
      [0, 1, 2, 3],
      function(item, next){
        calls++;
        next();
      },
      function() {
        calls.should.equal(4);
        done();
      }
    )
  });
  
  it('should call callback with empty array', function(done) {
    asyncForEach(
      [],
      function() {},
      done
    )
  });
  
  it('should correctly pass errors to callback, and that subsequent items are never processed', function(done) {
    asyncForEach(
      ['foo', 'bar'],
      function(item, next) {
        item.should.not.equal('bar')
        next(new Error('something broke'));
      },
      function(err) {
        err.message.should.equal('something broke');
        done();
      }
    )
  });
  
  it('should correctly pass argument to the iterator', function(done) {
    asyncForEach(
      ['foo', 'bar'],
      function(item, arg, next) {
        arg.should.equal('woo');
        next();
      },
      ['woo'],
      function() {
        done();
      }
    )
  });
  
});