'use strict';

var eloquent = require('eloquent');

var structure = {
	_constructor: function (transaction, table, columns, length) {
		Object.defineProperty(this, 'transaction', {
			value: transaction
		});

		Object.defineProperty(this, 'table', {
			enumerable: true,
			value: table
		});

		Object.defineProperty(this, 'length', {
			value: length
		});

		Object.defineProperty(this, 'columns', {
			value: Object.freeze(columns.slice())
		});
	},

	pluck: require('./api/pluck')
};

var api = eloquent(structure);

module.exports = api;
