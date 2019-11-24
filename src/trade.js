class Trade {
  constructor({ price, time, size, pair }) {
    this.price = price;
    this.time = time;
    this.size = size;
    this.pair = pair;
  }
}

module.exports = { Trade };
