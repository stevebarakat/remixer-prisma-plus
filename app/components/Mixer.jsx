import { useState, useEffect, useRef, useCallback } from "react";
import {
  loaded,
  Player,
  EQ3,
  Channel,
  Meter,
  Reverb,
  Gain,
  Volume,
  Add,
  Chorus,
  Distortion,
  PitchShift,
  Phaser,
  FeedbackDelay,
  Transport as t,
} from "tone";
import Controls from "./Controls";
import MasterVol from "./MasterVol";
import Bus1 from "./Bus1";
import ChannelStrip from "./ChannelStrip";
import Loader from "./Loader";

function Mixer({ song }) {
  const tracks = song.tracks;
  const requestRef = useRef();
  const channels = useRef([]);
  const players = useRef([]);
  const eqs = useRef([]);
  const meters = useRef([]);
  const masterMeter = useRef(null);
  const busOneMeter = useRef(null);
  const busOneChannel = useRef(null);
  const [meterVals, setMeterVals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [busOneFxOneType, setBusOneFxOneType] = useState(null);
  const [busOneFxOneChoice, setBusOneFxOneChoice] = useState(null);
  const handleSetBusOneFxOneChoice = (value) => setBusOneFxOneChoice(value);
  const [busOneFxTwoType, setBusOneFxTwoType] = useState(null);
  const [busOneFxTwoChoice, setBusOneFxTwoChoice] = useState(null);
  const handleSetBusOneFxTwoChoice = (value) => setBusOneFxTwoChoice(value);
  const [state, setState] = useState("stopped");
  const handleSetState = (value) => setState(value);
  const [busOneActive, setBusOneActive] = useState(false);
  const [temp, setTemp] = useState([false, false, false, false]);

  // console.log("busOneFxOneChoice", busOneFxOneChoice);
  // console.log("busOneFxOneType", busOneFxOneType);

  t.set({ bpm: 92 });
  // make sure song stops at end
  if (t.seconds > song.end) {
    t.position = song.end;
    t.stop();
    setState("stopped");
  }
  // make sure song doesn't rewind past start position
  if (t.seconds < 0) {
    t.position = song.start;
    t.seconds = song.start;
  }
  useEffect(() => {
    // create audio nodes
    masterMeter.current = new Meter();
    busOneMeter.current = new Meter();

    for (let i = 0; i < tracks.length; i++) {
      channels.current.push(
        new Channel(tracks[i].volume || -32, tracks[i].pan).toDestination()
      );
      players.current.push(new Player(tracks[i].path));
      eqs.current.push(new EQ3());
      meters.current.push(new Meter());
    }

    // connect everything
    players.current.forEach((player, i) =>
      player
        .chain(eqs.current[i], channels.current[i], meters.current[i])
        .sync()
        .start()
    );

    return () => {
      t.stop();
      players.current.forEach((player, i) => {
        player.dispose();
        meters.current[i].dispose();
        eqs.current[i].dispose();
        channels.current[i].dispose();
        busOneMeter.current.dispose();
        masterMeter.current.dispose();
      });
      players.current = [];
      meters.current = [];
      eqs.current = [];
      channels.current = [];
    };
  }, [tracks]);

  useEffect(() => {
    loaded().then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.current.forEach((meter, i) => {
      meterVals[i] = meter.getValue() + 85;
      setMeterVals(() => [...meterVals]);
    });
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [meterVals]);

  // triggers animateMeter
  useEffect(() => {
    if (state !== "started") return;
    requestAnimationFrame(animateMeter);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // when busOneFxOneChoice is selected it initiates new FX
  useEffect(() => {
    switch (busOneFxOneChoice) {
      case "FX1":
        setBusOneFxOneType(null);
        break;
      case "reverb":
        setBusOneFxOneType(new Reverb({ decay: 3, wet: 1 }).toDestination());
        break;
      case "delay":
        setBusOneFxOneType(
          new FeedbackDelay({
            delayTime: "1n",
            wet: 1,
          }).toDestination()
        );
        break;
      case "chours":
        setBusOneFxOneType(
          new Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0.5,
            wet: 1,
          }).toDestination()
        );
        break;
      case "phaser":
        setBusOneFxOneType(
          new Phaser({
            wet: 1,
            frequency: 15,
            octaves: 5,
            baseFrequency: 1000,
          }).toDestination()
        );
        break;
      case "pitch-shift":
        setBusOneFxOneType(
          new PitchShift({
            pitch: 24,
            wet: 1,
          }).toDestination()
        );
        break;
      case "distortion":
        setBusOneFxOneType(
          new Distortion({
            distortion: 8,
            wet: 1,
          }).toDestination()
        );
        break;
      default:
        break;
    }
  }, [busOneFxOneChoice]);

  // when busOneFxTwoChoice is selected it initiates new FX
  useEffect(() => {
    switch (busOneFxTwoChoice) {
      case "FX2":
        setBusOneFxTwoType(null);
        break;
      case "reverb":
        setBusOneFxTwoType(new Reverb({ decay: 3, wet: 1 }).toDestination());
        break;
      case "delay":
        setBusOneFxTwoType(
          new FeedbackDelay({
            delayTime: "1n",
            wet: 1,
          }).toDestination()
        );
        break;
      case "chours":
        setBusOneFxTwoType(
          new Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0.5,
            wet: 1,
          }).toDestination()
        );
        break;
      case "phaser":
        setBusOneFxTwoType(
          new Phaser({
            wet: 1,
            frequency: 15,
            octaves: 5,
            baseFrequency: 1000,
          }).toDestination()
        );
        break;
      case "pitch-shift":
        setBusOneFxTwoType(
          new PitchShift({
            pitch: 24,
            wet: 1,
          }).toDestination()
        );
        break;
      case "distortion":
        setBusOneFxTwoType(
          new Distortion({
            distortion: 8,
            wet: 1,
          }).toDestination()
        );
        break;
      default:
        break;
    }
  }, [busOneFxTwoChoice]);

  useEffect(() => {
    if (busOneFxOneChoice === "FX1") busOneFxOneType.dispose();
    if (busOneFxOneType === null || busOneChannel.current === null) return;
    console.log("busOneFxOneType", busOneFxOneType);
    busOneChannel.current.connect(busOneFxOneType);
    return () => busOneFxOneType.dispose();
  }, [busOneFxOneType, busOneFxOneChoice]);

  useEffect(() => {
    if (busOneFxTwoChoice === "FX2") busOneFxTwoType.dispose();
    if (busOneFxTwoType === null || busOneChannel.current === null) return;
    console.log("busOneFxTwoType", busOneFxTwoType);
    busOneChannel.current.connect(busOneFxTwoType);
    return () => busOneFxTwoType.dispose();
  }, [busOneFxTwoType, busOneFxTwoChoice]);

  function toggleBusOne(e) {
    const id = parseInt(e.target.id.toString()[0], 10);
    for (let i = 0; i < tracks.length; i++) {
      console.log(e.target.checked);
      temp[id] = e.target.checked;
      setTemp(temp);
      console.log("temp", temp);
      setBusOneActive(temp.find((item) => item === true));
      console.log(
        "find",
        temp.find((item) => item === true)
      );
      if (i === id) {
        if (e.target.checked) {
          busOneChannel.current = new Volume({ volume: -32 }).toDestination();
          channels.current[i].connect(busOneChannel.current);
        } else {
          busOneChannel.current.dispose();
        }
      }
    }
  }

  // wait for the buffers to load
  return isLoaded === false ? (
    <div className="loader-wrap">
      <div className="logo-wrap">
        <img src="/remix.svg" alt="remix" width="500" />
      </div>
      <span>
        Loading: {song.artist} - {song.name}{" "}
      </span>
      <Loader />
    </div>
  ) : (
    <div className="console">
      <div className="header-wrap">
        <div className="logo-wrap">
          <img src="/remix.svg" alt="remix" width="600" />
          <p style={{ fontWeight: "bold" }}>version 0.0.0.0.1</p>
        </div>
        <div className="song-info">
          <p>Artist: {song.artist}</p>
          <p>Song:{song.name}</p>
          <p>Year:{song.year}</p>
          <p>Studio:{song.studio}</p>
          <p>Location:{song.location}</p>
        </div>
      </div>
      <div className="mixer">
        {tracks.map((track, i) => {
          return (
            <ChannelStrip
              key={track.path}
              index={i}
              meterVal={meterVals[i]}
              channel={channels.current[i]}
              eq={eqs.current[i]}
              track={track}
              state={state}
              toggleBusOne={toggleBusOne}
            />
          );
        })}
        <Bus1
          state={state}
          busOneActive={busOneActive}
          busOneChannel={busOneChannel.current}
          handleSetBusOneFxOneChoice={handleSetBusOneFxOneChoice}
          handleSetBusOneFxTwoChoice={handleSetBusOneFxTwoChoice}
          busOneMeter={busOneMeter.current}
        />
        <MasterVol state={state} masterMeter={masterMeter.current} />
      </div>
      <div className="controls-wrap">
        <div className="controls-well">
          <Controls song={song} state={state} handleSetState={handleSetState} />
        </div>
      </div>
    </div>
  );
}

export default Mixer;
