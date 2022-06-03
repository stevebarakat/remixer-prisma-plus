// convert a value from one scale to another
// e.g. App.util.scale(-96, -192, 0, 0, 100) to convert
// -96 from dB (-192 - 0) to percentage (0 - 100)
export const scale = function (val, f0, f1, t0, t1) {
  return ((val - f0) * (t1 - t0)) / (f1 - f0) + t0;
};

// convert dBFS to a percentage
export const dBToPercent = function (dB) {
  return scale(dB, 0, 1, -100, 12);
};

// convert percentage to dBFS
export const percentTodB = function (percent) {
  return scale(percent, -100, 12, 0, 1);
};
