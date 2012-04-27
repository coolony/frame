/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var _ = require('underscore')
var Cache = require('./cache')
var extend = require('./classes').extend;


/**
 * Constructor for a CappedCache object with `size`.
 *
 * @param {Int} [size] Max items in cache. Defaults to 100.
 * @api public
 */
function CappedCache(size) {
  CappedCache._superclass.call(this);

  this._addedItems = [];
  this._size = Math.max(size || 100, 1);
}
extend(CappedCache, Cache);


/**
 * Cache `data` with `key`.
 *
 * @param {Mixed} key
 * @param {Mixed} data
 * @return {Object} self
 * @constructor
 * @extends Cache
 * @api public
 */

CappedCache.prototype.cache = function(key, data) {

  // There is nothing to cache
  if(_.isUndefined(key) || _.isUndefined(data))
    return this;

  // If no version is already in cache
  if(_.isUndefined(this.get(key))) {

    // Dirty older element if required
    if(this._addedItems.length == this._size) {
      this.dirty(this._addedItems.shift());
    }

    // Add the new element to the list
    this._addedItems.push(key);
  }

  // Call parent cache
  CappedCache._superproto.cache.call(this, key, data);

  return this;
}


/**
 * Dirty `key`. If no key is provided, the entire cache will be dirtied.
 *
 * @param {Mixed} [key…] Specific keys to remove from cache
 * @return {Object} self
 * @api public
 */

CappedCache.prototype.dirty = function() {

  var args = Array.prototype.slice.call(arguments);

  // Call parent dirty
  CappedCache._superproto.dirty.apply(this, arguments);

  // Clear cache if no arguments provided
  if(!args.length) {
    this._addedItems = [];
    return this;
  };

  // Update key order array
  this._addedItems = _.without.apply(this, [this._addedItems].concat(args));

  return this;
}


/**
 * Exports
 */

module.exports = CappedCache;
