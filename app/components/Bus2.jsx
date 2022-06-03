import { useState, useEffect, useRef, useCallback } from "react";
import VuMeter from "./VuMeter";
import { dBToPercent } from "~/utils/scale";

export default function Bus2({
  state,
  busTwoChannel,
  handleSetBusTwoFxOneChoice,
  handleSetBusTwoFxTwoChoice,
  busTwoActive,
  busTwoMeter,
}) {
  const requestRef = useRef();
  const [masterMeterVal, setMasterMeterVal] = useState(-12);
  const [masterVol, setMasterVol] = useState(0);
  if (busTwoChannel !== null) {
    busTwoChannel.connect(busTwoMeter);
  }

  function changeMasterVolume(e) {
    if (!busTwoActive) return;
    const value = parseInt(e.target.value, 10);
    const v = Math.log(value + 101) / Math.log(113);
    const sv = dBToPercent(v);
    setMasterVol(Math.round(sv));
    busTwoChannel.set({ volume: value });
  }

  const animateMeter = useCallback(() => {
    setMasterMeterVal(busTwoMeter.getValue() + 85);
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [busTwoMeter]);

  useEffect(() => {
    if (!busTwoActive) {
      setMasterMeterVal(-112);
      return cancelAnimationFrame(requestRef.current);
    }
    if (state === "started") {
      requestAnimationFrame(animateMeter);
    } else {
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, busTwoActive]);

  return (
    <div>
      {busTwoActive === true ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              onChange={(e) => handleSetBusTwoFxOneChoice(e.target.value)}
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
              onChange={(e) => handleSetBusTwoFxTwoChoice(e.target.value)}
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
            min={-100}
            max={12}
            defaultValue={-32}
            step="0.1"
            onChange={changeMasterVolume}
          />
        </div>
        <div className="track-labels">
          <span className="track-name">Bus 2</span>
        </div>
      </div>
    </div>
  );
}
