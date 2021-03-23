const Client = require("../Client");
const UserController = require("../controllers/UserController");
const { default: Collection } = require("../util/Collection");
const { EVENT } = require("../util/constraints");

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
	 * This function will get a user by their user id.  If they are in the user cache, it will
	 * pull that, otherwise it will add them to the cache.
	 * 
	 * @param {String} id User ID
	 */
	get (id) {
		if (this._userControllerCache.has(id)) {
			return this._userControllerCache.get(id);
		} else {
            // ... Get User Information Manually
            return null;
        }
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
