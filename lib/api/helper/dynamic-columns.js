'use strict';

function checkAdd(chain, structure, column, name) {
	if (structure[name] instanceof Function) {
		chain[name] = function () {
			this.column = column;
			return structure[name].apply(this, arguments);
		};
	}
}

module.exports = function dynamicColumns(thisObj, structure) {
	var result = {};

	thisObj.columns.forEach(function (column) {
		var chain = {
			_returns: structure._returns,
			_dynamic: structure._dynamic
		};

		checkAdd(chain, structure, column, '_getter');
		checkAdd(chain, structure, column, '_method');

		for (var k in structure) {
			if (structure.hasOwnProperty(k) && k[0] !== '_') {
				chain[k] = structure[k];
			}
		}

		result[column] = chain;
	});

	return result;
};
