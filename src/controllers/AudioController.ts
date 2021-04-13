import Client from "../Client";

class AudioController {
  _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  initialize(): void {
    throw new Error("Not implemented");
  }

  transmit(): void {
    throw new Error("Not implemented");
  }

  receive(): void {
    throw new Error("Not implemented");
  }
}

export default AudioController;
