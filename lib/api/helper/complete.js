'use strict';

module.exports = {
	_returns: true,
	_method: function complete() {
		this.transaction.operations.push(this);
		return this;
	}
};
