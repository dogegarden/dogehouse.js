'use strict';

const UserController = require('../dhjs/src/controllers/UserController');

module.exports = {
	Client: require('./src/Client'),

	MessageController: require('./src/controllers/MessageController'),
	RoomController: require('./src/controllers/RoomController'),
	UserController: require('./src/controllers/UserController')
};
