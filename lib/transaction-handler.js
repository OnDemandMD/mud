'use strict';

var async = require('async');
var emplace = require('emplace');

module.exports = function handler(db, transaction, cb) {
	db.protocol.transactionBegin(db, function (err, transactionId) {
		if (err) {
			return cb(err);
		}

		var emplaced = [];

		async.eachSeries(transaction.operations, function (operation, cb) {
			db.protocol.operate(db, transactionId, operation, function (err, result) {
				if (err) {
					return cb(err);
				}

				result = result || {};

				emplace.replace(operation, result);
				emplaced.push(operation);
				return cb();
			});
		}, function (err) {
			if (err) {
				return db.protocol.transactionRollback(db, transactionId,
						function (rerr) {
							emplaced.forEach(function (o) {
								emplace.clear(o);
							});

							if (rerr) {
								return cb(rerr);
							}

							return cb(err);
						});
			}

			return db.protocol.transactionCommit(db, transactionId, cb);
		});
	});
};
