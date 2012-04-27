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
 * Simple class inheritance.
 * Make `subclass` inherit from `superclass.
 *
 * based on http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
 * @param {Object} subclass
 * @param {Object} superclass
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
 * Dynamic class constructor.
 * Calls `constructor` with `args`, and return constructed object.
 *
 * @see http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
 * @param {Object} constructor
 * @param {Array} args…
 * @return {Object}
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
