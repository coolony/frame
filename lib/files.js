/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var fs = require('fs');


/**
 * Synchronously require all files in `dir`, and return a collection.
 *
 * @param {String} dir
 * @api public
 */

function requireDir(dir) {
  var collection = {};
  if(dir.slice(-1) !== '/') dir = dir + '/';
  fs.readdirSync(dir).forEach(function(file) {
    if(file.slice(-3) != '.js') return;
    collection[file.slice(0, -3)] = require(dir + file);
  });
  return collection;
}


/**
 * Exports
 */

module.exports = {
  requireDir: requireDir
};
