/**
 * Candlestick interface and implementation.
 */

class Candlestick {
  /**
   * Constructs the Candlestick instance.
   *
   * @param {float} low - lowest price of the asset in a particular interval.
   * @param {float} high highest price of the asset in a particular interval.
   * @param {float} close last traded price of the asset in a particular interval usually called as closing balance.
   * @param {float} open first traded price of the asset in a particular interval usually called as opening balance.
   * @param {int} interval in seconds in which we want to construct this candelestick.
   * @param {date} startTime is the time when this candelestick is constructed.
   * @param {float} volume is the size of asset which is traded in a particular tick.
   * @param {float} price is the last price from the tick.
   */
  constructor({
    low,
    high,
    close,
    open,
    interval,
    startTime = new Date(),
    volume,
    price
  }) {
    this.startTime = startTime;
    this.interval = interval;
    this.open = open || price;
    this.close = close || price;
    this.high = high || price;
    this.low = low || price;
    this.volume = volume || 1e-5;
    this.state = close ? "closed" : "open";
  }

  average() {
    return (this.close + this.high + this.low) / 3;
  }

  onPrice({ price, volume, time = new Date() }) {
    if (this.state === "closed") {
      throw new Error("Trying to add to closed candlestick");
    }

    this.volume = this.volume + volume;

    if (this.high < price) {
      this.high = price;
    }
    if (this.low > price) {
      this.low = price;
    }

    this.close = price;

    const delta = (time - this.startTime) * 1e-3;

    if (delta >= this.interval) {
      this.state = "closed";
    }
  }
}

module.exports = { Candlestick };
