import { useState, useEffect, useRef, useCallback } from "react";
import { Destination } from "tone";
import VuMeter from "./VuMeter";
import { scale } from "~/utils/scale";

function Bus1({
  state,
  busOneChannel,
  handleSetBusOneFxOneChoice,
  handleSetBusOneFxTwoChoice,
  busOneActive,
}) {
  const requestRef = useRef();
  const [masterMeterVal, setMasterMeterVal] = useState(-12);
  const [masterVol, setMasterVol] = useState(0.5);

  function changeMasterVolume(e) {
    const value = parseFloat(e.target.value);
    // const v = Math.log(value + 61) / Math.log(67);
    // const sv = scale(v, 0, 1, -60, 6);
    setMasterVol(value);
    busOneChannel.set({ gain: value });
  }

  // const animateMeter = useCallback(() => {
  //   setMasterMeterVal(masterMeter.getValue() + 85);
  //   requestRef.current = requestAnimationFrame(animateMeter);
  // }, [masterMeter]);

  // useEffect(() => {
  //   if (state === "started") {
  //     requestAnimationFrame(animateMeter);
  //   } else {
  //     return () => {
  //       cancelAnimationFrame(requestRef.current);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state]);

  return (
    <div>
      {busOneActive === true ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              onChange={(e) => handleSetBusOneFxOneChoice(e.target.value)}
              className="effect-select"
            >
              <option value="fx1">FX1</option>
              <option value="reverb">Reverb</option>
              <option value="delay">Delay</option>
              <option value="chours">Chorus</option>
              <option value="phaser">Phaser</option>
              <option value="pitch-shift">PitchShift</option>
              <option value="distortion">Distortion</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              onChange={(e) => handleSetBusOneFxTwoChoice(e.target.value)}
              className="effect-select"
            >
              <option value="fx1">FX2</option>
              <option value="reverb">Reverb</option>
              <option value="delay">Delay</option>
              <option value="chours">Chorus</option>
              <option value="phaser">Phaser</option>
              <option value="pitch-shift">PitchShift</option>
              <option value="distortion">Distortion</option>
            </select>
          </div>
        </>
      ) : null}

      <div
        className="fader-wrap"
        style={{
          padding: "12px 0 0 0",
          margin: "0 0 0 16px",
        }}
      >
        <div className="window js-window">
          <input
            disabled
            type="text"
            className="level-val"
            value={masterVol + " db"}
          />
        </div>
        <div className="levels-wrap">
          <VuMeter meterValue={masterMeterVal} height={450} width={12.5} />
        </div>
        <div className="master-vol-wrap">
          <input
            className="master-volume"
            type="range"
            min={0}
            max={1}
            defaultValue={0.5}
            step="0.000001"
            onChange={changeMasterVolume}
          />
        </div>
        <div className="track-labels">
          <span className="track-name">Bus 1</span>
        </div>
      </div>
    </div>
  );
}

export default Bus1;
