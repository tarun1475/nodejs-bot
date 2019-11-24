const ws = require("ws");
// TODO: fetch the socket url from the config file
const socketClient = new ws("wss://api-pub.bitfinex.com/ws/2");

class Ticker {
  constructor({ pair, onTick }) {
    this.pair = pair;
    this.onTick = onTick;
    this.running = false;
  }

  init() {
    this.running = true;
    socketClient.on("message", async msg => {
      await this.onTick(msg);
    });

    let msg = JSON.stringify({
      event: "subscribe",
      channel: "ticker",
      symbol: "tBTCUSD"
    });

    socketClient.on("open", () => socketClient.send(msg));
  }
}

module.exports = { Ticker };
