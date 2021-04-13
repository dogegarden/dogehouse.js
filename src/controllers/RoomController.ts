import { RawRoomData } from "../../interface";
import Client from "../Client";
import { default as Collection } from "../util/Collection";
import { OP_CODE } from "../util/constraints";
import UserController from "./UserController";

class RoomController {
  private _client: Client;

  private _rawData: Partial<RawRoomData> = {};

  private _id: string;

  private _name: string;

  private _description: string;

  private _isPrivate: boolean;

  private _created: number;

  private _creator: string;

  private _voiceServer: string;


  /**
   * @param {RawRoomData} data The raw room data.
   * @param {Client} client The application client
   */
  constructor(data: Partial<RawRoomData> = {}, client: Client) {
    /** @private */
    this._client = client;

    /** @private */
    this._rawData = data;

    /** @private */
    this._id = data.id;

    /** @private */
    this._name = data.name;

    /** @private */
    this._description = data.description;

    /** @private */
    this._isPrivate = data.isPrivate;

    /** @private */
    this._created = Date.parse(data.inserted_at);

    /** @private */
    this._creator = data.creatorId;

    /** @private */
    this._voiceServer = data.voiceServerId;
  }

  /**
   * This will return the room ID.
   * @type {String}
   * @readonly
   */
  get id() {
    return this._id;
  }

  /**
   * This will return the room name.
   * @type {String}
   * @readonly
   */
  get name() {
    return this._name;
  }

  /**
   * This will return the room Description
   * @type {String}
   * @readonly
   */
  get description() {
    return this._description;
  }

  /**
   * This will return weather the room is private or not.
   * @type {Boolean}
   * @readonly
   */
  get isPrivate() {
    return this._isPrivate;
  }

  /**
   * This will return the date that the room was created.
   * @type {Date}
   * @readonly
   */
  get created() {
    return this._created;
  }

  /**
   * This will return the creator of the room.
   * @type {UserController}
   */
  get creator() {
    return this._creator;
  }

  /**
   * Get Voice Server ID
   * @type {String}
   */
  get voiceServer() {
    return this._voiceServer;
  }

  /**
   * Get all of the users currently in the voice channel
   *
   * This will return a collection of all of the users currently in the room.
   *
   * @async
   * @type {Promise<Collection<String, UserController>>}
   * @returns {Collection<String, UserController>}
   */
  get users() {
    return new Promise((resolve, _reject) => {
      this._client.api.onMessageOnce(
        OP_CODE.GET_CURRENT_ROOM_USERS_DONE,
        (dat) => {
          const usrs = new Collection();

          dat.d.users.forEach((u) => {
            const controller = this._client.users.setUserData(u);

            usrs.set(controller.id, controller);
          });

          return resolve(usrs);
        }
      );
      this._client.api.send(OP_CODE.GET_CURRENT_ROOM_USERS, {}, null);
    });
  }
  // ... Add Room controls here when the moderator can do more things..
}

export default RoomController;

/**
 * @typedef {Object} PeoplePreviewObject
 * @property {Number} numFollowers The number of followers the user has.
 * @property {String} id The user's ID.
 * @property {String} displayName The user's display name.
 */

/**
 * @typedef {Object} RawRoomData
 * @property {String} voiceServerId The voice server that the room is on.
 * @property {PeoplePreviewObject[]} peoplePreviewList preview all of the people in the room.
 * @property {Number} numPeopleInside The number of people in the room.
 * @property {String} name The name of the room.
 * @property {Boolean} isPrivate Is the room private?
 * @property {String} inserted_at The date the room was created.
 * @property {String} id The room's id.
 * @property {String} description The room's description
 * @property {creatorId} creatorId The creator of the room.
 */
