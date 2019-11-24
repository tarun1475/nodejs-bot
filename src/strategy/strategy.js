const { Trade } = require("../trade");
const { Position } = require("../position");

class Strategy {
  constructor({ onBuySignal, onSellSignal }) {
    this.onBuySignal = onBuySignal;
    this.onSellSignal = onSellSignal;
    this.positions = {};
  }

  getPositions() {
    return Object.keys(this.positions).map(k => this.positions[k]);
  }

  openPositions() {
    return this.getPositions().filter(p => p.state === "open");
  }

  async positionOpened({ price, time, size, id, pair }) {
    const trade = new Trade({ price, time, size });
    const position = new Position({ trade, id });
    console.log(
      `Side : Buy - Price : ${price} - Pair: ${pair} - Volume: ${size} BTC `
    );
    this.positions[id] = position;
  }

  async positionClosed({ price, time, size, id, pair }) {
    const trade = new Trade({ price, time, size });
    console.log(
      `Side : Sell - Price : ${price} - Pair: ${pair} - Volume: ${size} BTC `
    );
    const position = this.positions[id];

    if (position) {
      position.close({ trade });
    }
  }
}

module.exports = Strategy;
