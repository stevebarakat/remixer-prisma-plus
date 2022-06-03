import { useState } from "react";
import { Knob } from "react-rotary-knob";
import skin from "~/utils/skin";
import { useFetcher } from "@remix-run/react";

function LimitedKnob({ track, eq, value, ...rest }) {
  const fetcher = useFetcher();
  const [midEqLevel, setMidEqLevel] = useState(track.midEqLevel);

  function changeMidEqLevel(val) {
    eq.set({ mid: val });
    console.log("val", val);
    fetcher.submit(
      {
        actionName: "changeMidEqLevel",
        track: JSON.stringify(track),
        midEqLevel: val,
      },
      { method: "post", action: "/actions", replace: true }
    );
    //ignore change if distance is greater than defined
    //here we use a distance of 200 because our max value is 1000
    //change if needed
    const maxDistance = 200;
    let distance = Math.abs(Math.abs(val) - midEqLevel);
    console.log("distance", distance);
    if (distance > maxDistance) {
      return;
    } else {
      setMidEqLevel(val);
    }
  }

  return (
    <Knob
      value={midEqLevel}
      onChange={changeMidEqLevel}
      skin={skin}
      {...rest}
    />
  );
}

export default LimitedKnob;
