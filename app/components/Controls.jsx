import { useRef } from "react";
import { Transport } from "tone";
import Restart from "./Restart";
import Rewind from "./Rewind";
import FastFwd from "./FastFwd";
import Play from "./Play";
import { formatMilliseconds } from "~/utils/formatTime";

function Controls({ song, state, handleSetState }) {
  const startTime = useRef(Transport.now());
  const currentTime = useRef(Transport.now());

  return (
    <>
      <div className="buttons-wrap">
        <Restart song={song} startTime={startTime} />
        <Rewind startTime={startTime} startPosition={song.start} />
        <Play song={song} state={state} handleSetState={handleSetState} />
        <FastFwd
          startTime={startTime}
          currentTime={currentTime}
          startPosition={song.start}
          endPosition={song.end}
          handleSetState={handleSetState}
        />
      </div>
      <div className="clock">
        <div className="ghost">88:88:88</div>
        {formatMilliseconds(Transport.seconds)}
      </div>
      {/* <div className="window js-window">
        {formatMilliseconds(Transport.seconds)}
      </div> */}
    </>
  );
}

export default Controls;
