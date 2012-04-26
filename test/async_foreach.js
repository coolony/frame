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
      [0, 1, 2],
      function(item, next){
        next();
      },
      done
    )
  });
  
  it('should call callback with empty array', function(done) {
    asyncForEach(
      [],
      function(){},
      done
    )
  });
  
});