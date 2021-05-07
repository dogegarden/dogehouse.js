import fs from "fs";
import { TypedEmitter } from "tiny-typed-emitter"
import { ClientEvents } from "./util/types/events";

export class BaseClient extends TypedEmitter<ClientEvents>{
	constructor() {
		super();
	}

	/**
	 * Generates a random string of characters
	 * 
	 * @param length - The length of the string
	 * @returns A randomly generated string. 
	 */
	randStr(length: number): string {
		let result = [];
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) { 
		  result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
	   return result.join('');	
	}
}