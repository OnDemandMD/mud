'use strict';

var eloquent = require('eloquent');

var structure = {
	_constructor: function (transaction, table, columns, length) {
		Object.defineProperty(this, 'transaction', {
			configurable: true,
			value: transaction
		});

		Object.defineProperty(this, 'table', {
			configurable: true,
			enumerable: true,
			value: table
		});

		Object.defineProperty(this, 'length', {
			configurable: true,
			value: length
		});

		Object.defineProperty(this, 'columns', {
			configurable: true,
			value: Object.freeze(columns.slice())
		});
	},

	pluck: require('./api/pluck')
};

var api = eloquent(structure);

module.exports = api;
