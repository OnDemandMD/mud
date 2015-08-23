'use strict';

var url = require('url');

var registry = module.exports.registry = {};

module.exports.get = function getProtocol(connectionString, cb) {
	var urlInfo = url.parse(connectionString);
	var protocolName = urlInfo.protocol.slice(0, -1);

	if (!(protocolName in registry)) {
		return cb(new Error('invalid protocol: ' + protocolName));
	}

	var protocol = registry[protocolName];
	return cb(null, protocol, urlInfo);
};
