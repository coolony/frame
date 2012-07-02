/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Asynchronous ForEach implementation.
 * Iterates over `array`, invoking `fn(item, args…, next)` for each item, and
 * invoke `callback(err)` when done.
 *
 * @see http://zef.me/3420/async-foreach-in-javascript
 * @param {Array} array
 * @param {Function} fn
 * @param {Mixed[]} [args]
 * @param {Function} callback
 * @api puclic
 */


function asyncForEach(array, fn, args, callback) {

  if(typeof args === 'function' && !callback) {
    callback = args;
    args = null;
  }

  if(!args) args = [];
  array = array.slice(0);

  function handleProcessedCallback(err) {
    if(err) return callback(err);
    if(array.length > 0) {
      setTimeout(processOne, 0);
    } else {
      callback();
    }
  }

  function processOne() {
    var item = array.shift();
    fn.apply(this, [item].concat(args).concat([handleProcessedCallback]));
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