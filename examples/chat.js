/**
 * Interacting with chat
 * 
 * In this example, you will learn how to listen for messages, send messages,
 * reply to messages, whisper users, and use special objects such as emoji's
 * or user mentions
 */

require('dotenv').config(); // Get your bot tokens

const { Client, EVENT } = require('dhjs-staged');
const app = new Client();

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

/**
 * Connect to dogehouse
 * 
 * This will connect this client application to the dogehouse api. If you do not
 * do this, the bot will not work.
 */
app.connect(token, refreshToken).then(async () => {
	console.log('Bot connected.');
	app.rooms.join('YOUR ROOM TOKEN'); // This will allow you to join a room.
});

/**
 * Defining your message listener
 * 
 * This will begin listening for new messages sent in the chat of the room that the bot
 * is currently in.  Once a message has been sent, it will return a message controller, which
 * will allow you to easily manage your message.
 * 
 * The message controller will allow you to do things such as deleting, replying to, and getting
 * the author to name a few.
 */
app.on(EVENT.NEW_CHAT_MESSAGE, (message) => {

	/**
	 * Listening for specific messages
	 * 
	 * This will listen for the phrase "Hello bot." exactly, and if it is detected, it will
	 * then reply to the message.
	 */
	if (message.content == "Hello bot") {
		message.reply('Hi there human.'); // Bot replies to the message with "Hi there human"
	}

	/**
	 * Creating a message Object
	 * 
	 * By sending "Send an emoji", you will be whispered a message that contains an emoji in it.
	 * This is creating using a custom message utility that will take this custom message object
	 * and compile it into a dogehouse compatible message object.
	 * 
	 * These message objects will allow you to send things such as:
	 * * Emojis
	 * * Links
	 * * Mentions
	 */
	if (message.content == "Send an emoji") {
		const msgObj = [ "Okay pog!!", { emote : 'peepoJAMMER' } ];
		
		/**
		 * This message reply will send without the user mention.  It will also send as a whispered
		 * message.  It will do this because in the message options, I have defined "whispered" to be
		 * true and "mentionUser" to be false.
		 * 
		 * ** THE MESSAGE OPTIONS ARE COMPLETELY OPTIONAL **
		 */
		message.reply(msgObj, {whispered: true, mentionUser: false});
	}

	/**
	 * Log to console
	 * 
	 * This will take all of the messages and log them to console as they come in.
	 */
	console.log(`${message.author.username}: ${message.content}`);
})

/**
 * Sending message outside of a Chat event
 * 
 * This willshow you how you can send a message to a user or in the chat without having to listen
 * for another message.  You will learn how to send a message by itself, you will learn how to 
 * send a messge to a specific user as well as whisper a specific user.
 */
app.on(EVENT.USER_JOINED_ROOM, user => {

	const publicWelcomeMessage = [ { mention : user.username }, " has joined the room!" ];
	const privateWelcomeMessage = [ "Welcome to the room ", { mention : user.username }, " I hope you enjoy your stay." ];

	/**
	 * Send Public Message
	 * This will send a plain message as the bot.
	 */
	app.bot.sendMessage(publicWelcomeMessage);

	/**
	 * Send Private Message
	 * This will send a private message to the user that joined the room.
	 */
	user.whisper(privateWelcomeMessage);	
});
