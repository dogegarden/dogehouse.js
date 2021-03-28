const fs = require('fs')
const path = require('path')
const EventEmitter = require('events');
const { EVENT } = require('./util/constraints');
const { randomUUID } = require('./util/random');
const RANDOM_STRING = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
const RANDOM_STRING_LENGTH = RANDOM_STRING.length;

class BaseClient extends EventEmitter{
	
	constructor() {
		super(); // Call Event Emitter
	}

	/**
	 * Generate a random string
	 * 
	 * This function will generate a random string based on the length you provided.  Once generated,
	 * it will return a your random string.
	 * 
	 * @param {Number} length Length of the random string
	 * 
	 * @function
	 * @returns {String}
	 */
	randStr(length) {
		let result = '';

		for (let i = 0; i < length; i++) {
		    result += RANDOM_STRING.charAt(Math.floor(Math.random() * RANDOM_STRING_LENGTH));
		}

		return result;
	}

	/**
	 * Register Events
	 * 
	 * This function will register all of the internal event handlers.  This will allow us
	 * to listen for events independantly of anything else.
	 * 
	 * @param {String} dir Events Directory
	 * 
	 * @private
	 * @function
	 * @returns {Promise<any>}
	 */
	registerEvents(dir) {
		return new Promise((resolve, reject) => {
			fs.readdir(dir, (err, files) => {
				for (const f of files) {
					const fn = require(path.resolve(dir, f));
					this._eventCache.set(f.split('.')[0], fn);
				}
				return resolve();
			});
		});
	}

	/**
	 * Register Hooks
	 * 
	 * This function will gather all of the hooks from the hooks directory.  Once they're pulled, they will be
	 * put into the hooks collection which can be accessed globally.  Once they're in the hooks collection, they
	 * can be delcared anywhere.
	 * 
	 * @param {String} dir Hooks Directory
	 * 
	 * @private
	 * @function
	 * @returns {Promise<any>}
	 */
	registerHooks(dir) {
		return new Promise((resolve, _reject) => {
			fs.readdir(dir, (err, files) => {
				for (const f of files) {
					let hook;
					const hk = require(path.resolve(dir, f));
					if (typeof hk !== `object`) return;
					try {
						hook = require.resolve(hk.package);
					} catch (err) {
						this.emit(EVENT.IMPORT_HOOK_FAILED, err);
						return;
					}
					this._hooks.set(hk.name || hk.package, require(hk.package));
					this.emit(EVENT.IMPORT_HOOK_SUCCESS, this._hooks.get(hk.name));
				}
				return resolve();
			})
		})
	}

	// @TODO - unused - remove?
	generateUUID() {
		return randomUUID();
	}
}

module.exports = BaseClient;
