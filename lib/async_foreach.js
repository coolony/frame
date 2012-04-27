/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Asynchronous ForEach implementation
 * @see http://zef.me/3420/async-foreach-in-javascript
 * @param {Array} array Array to iterate over.
 * @param {Function} fn Function to call for each array element.
 * @param {Function} callback Function to call upon completion.
 */


function asyncForEach(array, fn, callback) {
  array = array.slice(0);
  function processOne() {
    var item = array.shift();
    fn(item, function(err) {
      if(err) return callback(err);
      if(array.length > 0) {
        setTimeout(processOne, 0);
      } else {
        callback();
      }
    });
  }
  if(array.length > 0) {
    setTimeout(processOne, 0);
  } else {
    callback();
  }
};


/**
 * Exports
 */

module.exports = asyncForEach;