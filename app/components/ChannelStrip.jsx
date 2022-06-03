import { useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { Knob } from "react-rotary-knob";
import skin from "~/utils/skin";
import VuMeter from "./VuMeter";
import { scale } from "../utils/scale";

function ChannelStrip({
  index,
  track,
  channel,
  eq,
  meterVal,
  state,
  toggleBusOne,
  toggleBusTwo,
}) {
  const fetcher = useFetcher();
  const [isMuted, setIsMuted] = useState(track.mute);
  const volume = useRef(track.volume);
  const preFader = meterVal;
  const postFader = meterVal + volume;
  const [isPostFader, setIsPostFader] = useState(true);
  const [highEqLevel, setHighEqLevel] = useState(track.highEqLevel);
  const [midEqLevel, setMidEqLevel] = useState(track.midEqLevel);
  const [lowEqLevel, setLowEqLevel] = useState(track.lowEqLevel);

  // THIS IS WHERE THE LOGARITHMIC SCALE IS SET
  function changeVolume(e) {
    if (isMuted) return;
    const value = parseFloat(e.target.value, 10);
    const vol = Math.log(value + 101) / Math.log(113);
    const scaledVol = scale(vol, 0, 1, -100, 12);

    volume.current = value;
    channel.set({ volume: scaledVol });
    fetcher.submit(
      {
        actionName: "changeVolume",
        track: JSON.stringify(track),
        volume: value,
      },
      { method: "post", action: "/actions", replace: true }
    );
  }

  // THIS IS WHERE PAN IS SET
  function changePan(e) {
    const pan = e.target.value;
    channel.set({ pan });
    fetcher.submit(
      {
        actionName: "changePan",
        track: JSON.stringify(track),
        pan,
      },
      { method: "post", action: "/actions", replace: true }
    );
  }

  // THIS IS WHERE SOLO IS SET
  function changeSolo(e) {
    const solo = e.target.checked;
    channel.set({ solo });
    fetcher.submit(
      {
        actionName: "changeSolo",
        track: JSON.stringify(track),
        solo,
      },
      { method: "post", action: "/actions", replace: true }
    );
  }

  // THIS IS WHERE MUTE IS SET
  function changeMute(e) {
    const mute = e.target.checked;
    setIsMuted(mute);
    channel.set({ mute });
    fetcher.submit(
      {
        actionName: "changeMute",
        track: JSON.stringify(track),
        mute,
      },
      { method: "post", action: "/actions", replace: true }
    );
  }

  // THIS IS WHERE HIGH EQ IS SET
  function changeHighEqLevel(val) {
    eq.high.value = val;
    fetcher.submit(
      {
        actionName: "changeHighEqLevel",
        track: JSON.stringify(track),
        highEqLevel: val,
      },
      { method: "post", action: "/actions", replace: true }
    );
    setHighEqLevel(val);
  }

  // THIS IS WHERE MID EQ IS SET
  function changeMidEqLevel(val) {
    eq.mid.value = val;
    fetcher.submit(
      {
        actionName: "changeMidEqLevel",
        track: JSON.stringify(track),
        midEqLevel: val,
      },
      { method: "post", action: "/actions", replace: true }
    );
    setMidEqLevel(val);
  }

  // THIS IS WHERE LOW EQ IS SET
  function changeLowEqLevel(val) {
    eq.low.value = val;
    fetcher.submit(
      {
        actionName: "changeLowEqLevel",
        track: JSON.stringify(track),
        lowEqLevel: val,
      },
      { method: "post", action: "/actions", replace: true }
    );
    setLowEqLevel(val);
  }

  return (
    <div className="channel">
      <div className="fader-wrap">
        <div className="fx-labels">EQ</div>
        <div id="hi">
          <fetcher.Form method="post" action="/actions">
            <input type="hidden" name="actionName" value="changeHighEqLevel" />
            <Knob
              className="knob"
              min={-8}
              max={8}
              preciseMode={true}
              unlockDistance={0}
              rotateDegrees={180}
              clampMin={40}
              clampMax={320}
              defaultValue={track.highEqLevel}
              value={highEqLevel}
              onChange={changeHighEqLevel}
              step={0.01}
              skin={skin}
              track={track}
            />
          </fetcher.Form>
        </div>
        <div id="mid">
          <fetcher.Form method="post" action="/actions">
            <input type="hidden" name="actionName" value="changeMidEqLevel" />
            <Knob
              onChange={changeMidEqLevel}
              className="knob"
              min={-8}
              max={8}
              preciseMode={true}
              unlockDistance={0}
              rotateDegrees={180}
              clampMin={40}
              clampMax={320}
              defaultValue={track.midEqLevel}
              value={midEqLevel}
              step={0.01}
              skin={skin}
              track={track}
            />
          </fetcher.Form>
        </div>
        <div id="low">
          <fetcher.Form method="post" action="/actions">
            <input type="hidden" name="actionName" value="changeLowEqLevel" />
            <Knob
              onChange={changeLowEqLevel}
              className="knob"
              min={-8}
              max={8}
              preciseMode={true}
              unlockDistance={0}
              rotateDegrees={180}
              clampMin={40}
              clampMax={320}
              defaultValue={track.lowEqLevel}
              value={lowEqLevel}
              step={0.01}
              skin={skin}
              track={track}
            />
          </fetcher.Form>
        </div>
      </div>
      <div className="solo-mute">
        <input
          id={`solo${track.path}`}
          type="checkbox"
          defaultChecked={track.solo}
          onChange={changeSolo}
        />
        <label className="label" htmlFor={`solo${track.path}`}>
          S
        </label>
        <input
          id={`mute${track.path}`}
          type="checkbox"
          defaultChecked={track.mute}
          onChange={changeMute}
        />
        <label className="label" htmlFor={`mute${track.path}`}>
          M
        </label>
      </div>
      <div className="bus">
        <input
          id={`${index}busOne${track.path}`}
          type="checkbox"
          onChange={toggleBusOne}
        />
        <label className="label" htmlFor={`${index}busOne${track.path}`}>
          Bus 1
        </label>
      </div>
      <div className="bus">
        <input
          id={`${index}busTwo${track.path}`}
          type="checkbox"
          onChange={toggleBusTwo}
        />
        <label className="label" htmlFor={`${index}busTwo${track.path}`}>
          Bus 2
        </label>
      </div>
      <div className="pfl">
        <input
          id={`postFader${track.path}`}
          type="checkbox"
          onChange={(e) => {
            setIsPostFader(!e.target.checked);
          }}
        />
        <label className="label" htmlFor={`postFader${track.path}`}>
          {isPostFader ? "POST" : "PRE"}
        </label>
      </div>

      <div className="fader-wrap">
        <div>
          <input
            id={track.id}
            className="pan"
            type="range"
            defaultValue={track.pan}
            min={-1}
            max={1}
            step={0.001}
            onChange={changePan}
          />
          <div className="pan-labels">
            <span>L</span>
            <span>R</span>
          </div>
        </div>
        <div className="window js-window">
          <input
            disabled
            type="text"
            className="level-val"
            value={Math.round(volume.current) + " db"}
          />
        </div>
        <div className="levels-wrap">
          <VuMeter
            meterValue={isPostFader ? postFader : preFader}
            height={300}
            width={10}
          />
        </div>
        <div className="vol-wrap">
          <input
            id={track.id}
            className="volume"
            type="range"
            min={-100}
            max={12}
            step={0.01}
            defaultValue={volume.current}
            onChange={changeVolume}
          />
        </div>
        <div className="track-labels">
          <span className="track-name">{track.name}</span>
        </div>
      </div>
    </div>
  );
}

export default ChannelStrip;
