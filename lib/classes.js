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
 * Simple class inheritance
 * based on http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
 * @param {Object} subclass Child class
 * @param {Object} superclass Parent class
 * @api public
 */

function extend(subclass, superclass) {
  function Dummy(){}
  Dummy.prototype = superclass.prototype;
  subclass.prototype = new Dummy();
  subclass.prototype.constructor = subclass;
  subclass._superclass = superclass;
  subclass._superproto = superclass.prototype;
}


/**
 * Dynamic class constructor
 * based on http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
 * @param {Object} constructor Class to construct
 * @param {Array} args Arguments to pass to class constructor
 * @return {Object} Constructed class
 * @api public
 */

function construct(constructor) {
  var args = _.toArray(arguments).slice(1);
  function F() {
    return constructor.apply(this, args);
  }
  F.prototype = constructor.prototype;
  return new F();
}


/**
 * Exports
 */

module.exports = {
  extend: extend,
  construct: construct
};
