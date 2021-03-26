const Client = require("../Client");
const UserController = require("../controllers/UserController");
const { default: Collection } = require("../util/Collection");
const { EVENT, OP_CODE } = require("../util/constraints");

class Users {
	/**
	 * @param {Client} client 
	 */
	constructor(client) {
		this._client = client;
	}

	/**
	 * UserController Cache
	 * @type {Collection<String, UserController>}
	 * @private
	 */
	_userControllerCache = new Collection();

	/**
	 * Set User Data
	 * 
	 * This function will allow you to cache a user, or update a user's data and then it will 
	 * return the Controller object.
	 * 
	 * @param {Object} data Raw User Data Object
	 * 
	 * @function
	 * @returns {UserController}
	 */
	setUserData (data) {
		if (!data?.id) return;
		let controller = this._userControllerCache.get(data.id);
		if (controller) controller.update(data);
		else this._userControllerCache.set(data.id, new UserController(data, this._client));
		return this.get(data.id);
	}

	/**
	 * Get User
	 * 
	 * This function will get a user by their user_id or username.  If they are in the user cache, it will
	 * pull that, otherwise it will add them to the cache.
	 * 
	 * @type {Promise<UserController> | UserController}
	 * @param {String} value User ID or Username
	 */
	get (value) {

		if (this._userControllerCache.has(value)) {
			return this._userControllerCache.get(value);
		}

		const ctlByName = this._userControllerCache.find(u => u.username === value);
		if (ctlByName) return ctlByName;

		const ctlByCaseI = this._userControllerCache.find(u => u.username.toLowerCase() === value.toLowerCase())
		if (ctlByCaseI) return ctlByCaseI;

		return new Promise(async (resolve, reject) => {
			return resolve(this._client.api.fetchData(OP_CODE.GET_USER_PROFILE, {userId: value}));
		});
	}

	/**
	 * Retrieve the User Cache
	 * 
	 * This will return the User Controller Cache which will have a list of all of the cached 
	 * users.
	 * 
	 * @type {Collection<String, UserController>}
	 */
	get cache() {
		return this._userControllerCache;
	}
}

module.exports = Users;
