'use strict';

var async = require('async');
var dynamicColumns = require('./helper/dynamic-columns');
var complete = require('./helper/complete');

function pluck(operation, results, cb) {
	async.map(results, function (result, cb) {
		if (!(operation.column in result)) {
			return cb('column not in result: ' + operation.column);
		}

		return cb(null, result[operation.column]);
	}, cb);
}

module.exports = {
	_dynamic: true,
	_getter: function () {
		this.operation = 'select';
		this.processor = pluck;
		return dynamicColumns(this, complete);
	}
};
