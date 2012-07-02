/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var _ = require('underscore')
  , path = require('path')
  , fs = require('fs')
  , exists = fs.exists || path.exists
  , existsSync = fs.existsSync || path.existsSync
  , asyncForEach = require('./async_foreach')
  , construct = require('./classes').construct
  , Cache = require('./cache');


/**
 * Strip trailing slash from `path`
 * @param {String} path
 * @return {String}
 * @api private
 */

function stripTrailingSlash(str) {
  if(str.substr(-1) == '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
}


/**
 * Constructor for a locator object with `folders` and `options`
 * @param {String|String[]} [folders]
 * @param {Object} options
 * @constructor
 * @api public
 */

function Locator(folders, options) {

  if(!options) options = {};
  if(!options.cache) options.cache = true;
  if(!options.cacheClass) options.cacheClass = Cache;
  if(!options.cacheOptions) options.cacheOptions = [];
  this._options = options;

  this._folders = [];
  if(options.cache) {
    var applyOptions = [options.cacheClass].concat(options.cacheOptions);
    this._cache = construct.apply(this, applyOptions);
  }
  this.addFolders(folders);
}


/**
 * Add `folders` to the search list
 * @param {String|String[]} [folders]
 * @return {Locator} self
 * @api public
 */

Locator.prototype.addFolders = function(folders) {
  if(!folders) return this;
  if('string' == typeof folders) folders = [folders];

  this._folders = _.union(this._folders, _.compact(folders).map(stripTrailingSlash));

  this._cache.dirty();

  return this;
}


/**
 * Remove `folders` from the search list
 * @param {String|String[]} [folders] Folders to remove
 * @return {Locator} self
 * @api public
 */

Locator.prototype.removeFolders = function(folders) {
  if(!folders) return this;
  if('string' == typeof folders) folders = [folders];

  this._folders = _.difference(this._folders, folders);

  this._cache.dirty();

  return this;
}


/**
 * Clear search list.
 * @return {Locator} self
 * @api public
 */

Locator.prototype.clearFolders = function() {
  this._folders = [];

  this._cache.dirty();

  return this;
}


/**
 * Locate `file`, and invoke `callback(err, paths)`.
 *
 * @param {String} file
 * @param {Function} callback
 * @return {Locator} self
 * @api public
 */

Locator.prototype.locate = function(file, callback) {
  var acc = [],
      _this = this;

  if(this._options.cache) {
    var cached = this._cache.get(file);
    if(cached){
      callback(cached);
      return this;
    }
  }

  asyncForEach(
    this._folders,
    function(item, next) {
      var testPath = path.join(item, file);
      exists(testPath, function(exists) {
        if(exists) acc.push(testPath);
        next();
      })
    },
    function(){
      if(_this._options.cache) _this._cache.cache(file, acc);
      if(callback) callback(acc);
    }
  );

  return this;
}


/**
 * Locate `file`, and invoke `callback(err, path)`.
 *
 * @param {String} file
 * @param {Function} callback Callback function to call upon completion
 * @return {Locator} self
 * @api public
 */

Locator.prototype.locateOne = function(file, callback) {
  this.locate(file, function(result){
    if(callback) callback(result[0] || null);
  })

  return this;
}


/**
 * Synchronously locate `file`, and return array of matches.
 *
 * @param {String} file
 * @return {String[]} Matched file paths
 * @api public
 */

Locator.prototype.locateSync = function(file) {
  var acc = [];

  if(this._options.cache) {
    var cached = this._cache.get(file);
    if(cached) return cached;
  }

  this._folders.forEach(function(item) {
    var testPath = path.join(item, file);
    if(existsSync(testPath)) acc.push(testPath);
  });

  if(this._options.cache) this._cache.cache(file, acc);

  return acc;
}


/**
 * Synchronously locate `file`, and return the first match.
 *
 * @param {String} file
 * @return {Locator} self
 * @api public
 */

Locator.prototype.locateOneSync = function(file) {

  var result = this.locateSync(file);

  return result[0] || null;
}


/**
 * Exports
 */

module.exports = Locator;
