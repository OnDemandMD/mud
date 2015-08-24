'use strict';

var dynamicColumns = require('./helper/dynamic-columns');
var complete = require('./helper/complete');

module.exports = {
	_dynamic: true,
	_getter: function () {
		this.operation = 'select';
		return dynamicColumns(this, complete);
	}
};
