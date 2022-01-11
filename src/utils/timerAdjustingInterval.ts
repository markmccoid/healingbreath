// The class based function didn't play well with my invoke from XState
// Rewrote it as function instead.
/**
 * Self-adjusting interval to account for drifting
 *
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 * */
export function myTicker(workFunc: () => void, interval: number): NodeJS.Timeout {
  function step(): NodeJS.Timeout {
    const drift = Date.now() - expected;
    workFunc();
    expected += interval;
    // return (timeoutId = setTimeout(step, Math.max(0, interval - drift)));
    const timeoutId = setTimeout(step, Math.max(0, interval - drift));
    return timeoutId;
  }
  let expected = Date.now() + interval;
  // return (timeout = setTimeout(step, interval));
  const timeoutId = setTimeout(step, interval);
  return timeoutId;
}

/**
 * Self-adjusting interval to account for drifting
 *
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
export function AdjustingInterval(workFunc, interval, errorFunc = () => {}) {
  var that = this;
  var expected, timeout;
  this.interval = interval;

  this.start = function () {
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval);
  };

  this.stop = function () {
    clearTimeout(timeout);
  };

  function step() {
    var drift = Date.now() - expected;
    if (drift > that.interval) {
      // You could have some default stuff here too...
      if (errorFunc) errorFunc();
    }
    workFunc();
    expected += that.interval;
    timeout = setTimeout(step, Math.max(0, that.interval - drift));
  }
}
