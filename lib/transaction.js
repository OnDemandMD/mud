'use strict';

var api = require('./api');

module.exports = function transaction(db, cb) {
	db.protocol.getTables(db, function (err, tables) {
		if (err) {
			return cb(err);
		}

		var transaction = {
			operations: []
		};

		Object.defineProperty(transaction, 'tables', {
			configurable: true,
			value: tables
		});

		Object.defineProperty(transaction, 'length', {
			configurable: true,
			enumerable: true,
			get: function () {
				return Object.getOwnPropertyNames(tables).length;
			}
		});

		for (var table in tables) {
			if (tables.hasOwnProperty(table)) {
				var data = tables[table];
				/* eslint-disable no-loop-func */
				/* https://jslinterrors.com/dont-make-functions-within-a-loop#comment-2212064190 */
				(function (table, columns, rowNum) {
					Object.defineProperty(transaction, table, {
						enumerable: true,
						get: function () {
							return api(transaction, table, columns, rowNum);
						}
					});
				})(table, data.columns || [], data.rows || 0);
				/* eslint-enable no-loop-func */
			}
		}

		return cb(null, transaction);
	});
};
