/*!
 * Coolony's Frame
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var _ = require('underscore')


/**
 * Decorates `func` with `decorator`.
 *
 * @param {Function} func
 * @param {Function} decorator…
 * @return {Function} Decorated function.
 * @api public
 */

function decorate(func) {
  var decorators = _.toArray(arguments).slice(1);
  decorators.forEach(function(decorator) {
    func = _.wrap(func, decorator);
  });
  return func;
}


/**
 * Exports
 */

module.exports.decorate = decorate;
