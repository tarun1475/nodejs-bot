const Strategy = require("./strategy");

class SimpleStrategy extends Strategy {
  async run({ sticks, time }) {
    const len = sticks.length;
    if (len < 3) {
      return;
    }

    const secondLast = sticks[len - 2].close;
    const last = sticks[len - 1].close;
    const price = last;
    const open = this.openPositions();

    if (open.length === 0) {
      if (last === secondLast) {
        this.onBuySignal({ price, time });
      }
    } else {
      open.forEach(p => {
        this.onSellSignal({
          price,
          size: p.enter.size,
          position: p,
          time
        });
      });
    }
  }
}

module.exports = SimpleStrategy;
