'use strict';

/*

	 ███▄ ▄███▓ █    ██ ▓█████▄
	▓██▒▀█▀ ██▒ ██  ▓██▒▒██▀ ██▌
	▓██    ▓██░▓██  ▒██░░██   █▌
	▒██    ▒██ ▓▓█  ░██░░▓█▄   ▌
	▒██▒   ░██▒▒▒█████▓ ░▒████▓
	░ ▒░   ░  ░░▒▓▒ ▒ ▒  ▒▒▓  ▒
	░  ░      ░░░▒░ ░ ░  ░ ▒  ▒
	░      ░    ░░░ ░ ░  ░ ░  ░
	       ░      ░        ░

	          an ORM
*/

var protocol = require('./lib/protocol');
var generateDB = require('./lib/generator');
var mud = module.exports = {};

mud.protocol = protocol.registry;

mud.connect = function connect(connectionString, opts, cb) {
	if (!cb) {
		cb = opts;
		opts = {};
	}

	var db = generateDB();

	protocol.get(connectionString, function (err, protocol, urlInfo) {
		if (err) {
			return cb(err);
		}

		db.protocol = protocol;
		db.urlInfo = urlInfo;

		db.protocol.connect(db, opts, function (err) {
			if (err) {
				return cb(err);
			}

			return cb(null, db);
		});
	});
};
