'use strict';

var url = require('url');
var mud = require('../');

module.exports.get = function getProtocol(connectionString, cb) {
	var urlInfo = url.parse(connectionString);
	var protocolName = urlInfo.protocol.substr(0, -1);

	if (!(protocolName in mud.protocol)) {
		return cb(new Error('invalid protocol: ' + protocolName));
	}

	var protocol = mud.protocol[protocolName];
	return cb(null, protocol);
};
