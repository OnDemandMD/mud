'use strict';

var EventEmitter = require('events').EventEmitter;
var weakInherit = require('weak-inherit');
var handleTransaction = require('./transaction-handler');
var api = require('./api');

var inheritEvents = weakInherit(EventEmitter);

function asyncify(fn) {
	return function () {
		var args = [].slice.call(arguments);
		var cb = args.pop();
		var result;
		try {
			result = fn.apply(this, args);
		} catch(e) {
			return cb(e);
		}
		return cb(null, result);
	};
}

module.exports = function generator() {
	var db = function (transactionFn, cb) {
		if (transactionFn.length === 0) {
			transactionFn = asyncify(transactionFn);
		}

		var transaction = api(db);
		transactionFn.call(transaction, function (err) {
			if (err) {
				return db.emit('error', err);
			}

			handleTransaction(db, transaction, cb);
		});
	};

	inheritEvents(db);

	return db;
};
