import { useState, useEffect, useRef, useCallback } from "react";
import { Destination } from "tone";
import VuMeter from "./VuMeter";
import { dBToPercent } from "~/utils/scale";

function MasterVol({ state, masterMeter }) {
  const requestRef = useRef();
  const [masterMeterVal, setMasterMeterVal] = useState(-12);
  const [masterVol, setMasterVol] = useState(0);
  Destination.connect(masterMeter);

  function changeMasterVolume(e) {
    const value = parseInt(e.target.value, 10);
    const v = Math.log(value + 101) / Math.log(113);
    const sv = dBToPercent(v);
    setMasterVol(Math.round(sv));
    Destination.set({ volume: sv });
  }

  const animateMeter = useCallback(() => {
    setMasterMeterVal(masterMeter.getValue() + 85);
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [masterMeter]);

  useEffect(() => {
    if (state === "started") {
      requestAnimationFrame(animateMeter);
    } else {
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
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
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default MasterVol;
