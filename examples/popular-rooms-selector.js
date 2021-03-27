/**
 * Room Selector
 * 
 * In this example, we will be creating a room selector in the terminal.  The way we will be 
 * doing this is by getting a list of the top rooms and creating a CLI prompt using the
 * prompts npm package.  When your bot start, you will get a terminal prompt which will allow
 * you to select the room you want your bot to connect to.  This will allow you to join a room
 * without needint to provide a room ID.
 * 
 * You must install prompts using "npm i prompts"
 * 
 * !!! CREDITS !!!
 * @author ErlendCat <https://github.com/ErlendCat> Thank you for creating the original room selector.
 */
require('dotenv').config(); // Get your bot tokens

const { Client, EVENT } = require('dhjs-staged');
const prompts = require('prompts');
const app = new Client();

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

const prompt = async (questions) => await prompts(questions);

/**
 * Connect to dogehouse
 * 
 * This will connect this client application to the dogehouse api. If you do not
 * do this, the bot will not work.
 */
app.connect(token, refreshToken).then(async () => {
	console.log('Bot connected.');
	
	let roomChoices = []
	let topRooms = (await app.rooms.top);

	/**
	 * Defining your room options
	 */
	topRooms.forEach(rm => roomChoices.push(rm.name));
	roomChoices.unshift('Custom room'); // Allows you to add a custom room.
	roomChoices.push('Cancel'); // Allows you to cancel selection.

	/**
	 * Create your prompt object
	 */
	promptObject = [
		{ type: 'select', name: 'room', message: 'What room would you like to join?', choices: roomChoices },
		{ type: (prev) => (prev === 0 ? 'text' : null), name: 'roomID', message: 'Please paste the roomID' }
	];

	let res = await prompt(promptObject); // Define your prompt object

	/**
	 * Defining your room choices
	 */
	if (res.room === roomChoices.length - 1) process.exit();
	app.rooms.join(res.room === 0 ? res.roomID : topRooms[res.room - 1].id);
});
