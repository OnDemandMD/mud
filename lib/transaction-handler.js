'use strict';

module.exports = function handler(db, transaction, cb) {
	if (!cb) {
		cb = function (err) {
			if (err) {
				throw err;
			}
		};
	}

	return cb();
};
