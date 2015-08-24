'use strict';

var EventEmitter = require('events').EventEmitter;
var weakInherit = require('weak-inherit');
var makeTransaction = require('./transaction');
var handleTransaction = require('./transaction-handler');

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
		if (!cb) {
			cb = function (err) {
				return db.emit('error', err);
			};
		}

		if (transactionFn.length === 0) {
			transactionFn = asyncify(transactionFn);
		}

		makeTransaction(db, function (err, transaction) {
			if (err) {
				return cb(err);
			}

			transactionFn.call(transaction, function (err) {
				if (err) {
					return cb(err);
				}

				handleTransaction(db, transaction, cb);
			});
		});
	};

	inheritEvents(db);

	return db;
};
