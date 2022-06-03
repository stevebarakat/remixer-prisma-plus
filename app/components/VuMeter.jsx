import { useRef, useEffect, useCallback } from "react";

// Settings
let curVal = 0;
const max = 100;
const boxCount = 100;
const boxCountRed = 20;
const boxCountYellow = 30;
const boxGapFraction = 0.2;

// Colors
const redOn = "hsla(302, 67%, 54%, 0.9)";
const redOff = "hsla(302, 67%, 24%, 0.9)";
const yellowOn = "hsla(47, 99%, 55%, 0.9)";
const yellowOff = "hsla(47, 99%, 25%, 0.9)";
const greenOn = "hsla(118, 60%, 63%, 0.9)";
const greenOff = "hsla(118, 60%, 33%, 0.9)";

function VuMeter({ meterValue, height, width }) {
  const stage = useRef();
  const drawRef = useRef();

  // Gap between boxes and box height
  const boxHeight = height / (boxCount + (boxCount + 1) * boxGapFraction);
  const boxGapY = boxHeight * boxGapFraction;

  const boxWidth = width - boxGapY * 2;
  const boxGapX = (width - boxWidth) / 2;

  // Get the color of a box given it's ID and the current value
  const getBoxColor = useCallback((id, val) => {
    if (id > boxCount - boxCountRed) {
      return id <= Math.ceil((val / max) * boxCount) ? redOn : redOff;
    }
    if (id > boxCount - boxCountRed - boxCountYellow) {
      return id <= Math.ceil((val / max) * boxCount) ? yellowOn : yellowOff;
    }
    return id <= Math.ceil((val / max) * boxCount) ? greenOn : greenOff;
  }, []);

  useEffect(() => {
    const c = stage.current.getContext("2d");

    c.fillStyle = "green";
    c.strokeStyle = "black";

    c.shadowBlur = 5;

    const draw = function () {
      const targetVal = parseInt(stage.current.dataset.volume, 10);

      // Gradual approach
      if (curVal <= targetVal) {
        curVal += (targetVal - curVal) / 5;
      } else {
        curVal -= (curVal - targetVal) / 5;
      }

      // Draw the container
      c.save();
      c.beginPath();
      c.rect(0, 0, width, height);
      c.fillStyle = "rgb(12,22,32)";
      c.fill();
      c.restore();

      // Draw the boxes
      c.save();
      c.translate(boxGapX, boxGapY);
      for (let i = 0; i < boxCount; i++) {
        const id = Math.abs(i - (boxCount - 1)) + 1;

        c.beginPath();
        if (id <= Math.ceil((targetVal / max) * boxCount)) {
          c.shadowBlur = 10;
          c.shadowColor = getBoxColor(id, targetVal);
        }
        c.rect(0, 0, boxWidth, boxHeight);
        c.fillStyle = getBoxColor(id, targetVal);
        c.fill();
        c.translate(0, boxHeight + boxGapY);
      }
      c.restore();

      drawRef.current = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => cancelAnimationFrame(drawRef.current);
  }, [width, height, boxHeight, boxGapY, boxGapX, getBoxColor, boxWidth]);

  useEffect(() => {
    stage.current.dataset.volume = meterValue;
  }, [meterValue]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas
        className="vu-meter"
        ref={stage}
        width={width}
        height={height}
        data-volume={0}
      />
    </div>
  );
}

export default VuMeter;
