'use strict';

module.exports = {
	/**
	 * Client and Base Client
	 */
	Client: require('./src/Client'),
	BaseClient: require('./src/BaseClient'),

	/**
	 * Classes
	 */
	API: require('./src/classes/API'),
	BotUser: require('./src/classes/API'),
	Chat: require('./src/classes/Chat'),
	Rooms: require('./src/classes/Rooms'),
	Telemetry: require('./src/classes/Telemetry'),
	Users: require('./src/classes/Users'),

	/**
	 * Controllers
	 */
	MessageController: require('./src/controllers/MessageController'),
	RoomController: require('./src/controllers/RoomController'),
	UserController: require('./src/controllers/UserController'),

	/**
	 * Miscellaneous 
	 */
	EVENT: require('./src/util/constraints').EVENT,
	utils: require('doge-utils'),
};
