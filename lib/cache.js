/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var _ = require('underscore');


/**
 * Constructor for a Cache object
 * @param {Int} size (Optional) Max items in cache. Defaults to 100.
 * @api public
 */

function Cache() {
  this._cache = {};
}


/**
 * Getter for cache size
 * @api public
 */

Cache.prototype.__defineGetter__("length", function() {
  return _.size(this._cache);
});


/**
 * Getter for the whole cache
 * @api public
 */

Cache.prototype.__defineGetter__("items", function() {
  return _.clone(this._cache);
});


/**
 * Cache some new data
 * @param {Mixed} key Key for the data
 * @param {Mixed} data Data to cache
 * @return {Object} self
 */

Cache.prototype.cache = function(key, data) {

  // There is nothing to cache
  if(_.isUndefined(key) || _.isUndefined(data))
    return this;

  // Cache the new object
  this._cache[key] = data;

  return this;
}


/**
 * Dirty keys
 * @param {Mixed} key,.. (Optional) Specific keys to remove from cache
 * @return {Object} self
 */

Cache.prototype.dirty = function() {

  var args = Array.prototype.slice.call(arguments)
    , _this = this;

  // Clear cache if no arguments provided
  if(!args.length) {
    this._cache = {};
    return this;
  };

  // Update key order array
  _.each(args, function(item) {
    delete _this._cache[item];
  });

  return this;
}


/**
 * Get key
 * @param {Mixed} key Key to get from cache
 * @return {Object} self
 */

Cache.prototype.get = function(key) {
  return this._cache[key];
}


/**
 * Get key or fill cache if missing
 * @param {Mixed} key Key to get from cache
 * @param {Function} fn Function called to fill cache
 * @param {Function} callback Callback function to call with the result
 * @return {Object} self
 */

Cache.prototype.getOrFill = function(key, fn, callback) {
  var item = this.get(key);

  // If key is in cache, return immediately
  if(!_.isUndefined(item)) {
    if(callback) callback(item);
    return this;
  }

  // Call the fill function
  var _this = this;
  fn(function(result) {
    _this.cache(key, result);
    if(callback) callback(result);
  });
}


/**
 * Get key or fill cache synchronously if missins
 * @param {Mixed} key Key to get from cache
 * @param {Function} fn Function called to fill cache
 * @return {Mixed} cached object or result from fill
 */

Cache.prototype.getOrFillSync = function(key, fn) {
  var item = this.get(key);

  // If key is in cache, return immediately
  if(!_.isUndefined(item)) return item;

  // Call the fill function
  var result = fn();
  this.cache(key, result);
  return result;
}


/**
 * Exports
 */

module.exports = Cache;
