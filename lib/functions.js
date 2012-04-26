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
 * Decorates a function
 *
 * @param {Function} func Function to decorate
 * @param {Function} decorators.. Function(s) to decorate func with
 * @return {Function} Decorated function
 * @api public
 */

function decorate() {
  var args = _.toArray(arguments);
      func = args[0];
      decorators = args.slice(1);
  decorators.forEach(function(decorator) {
    func = _.wrap(func, decorator);
  });
  return func;
}


/**
 * Exports
 */

module.exports.decorate = decorate;
