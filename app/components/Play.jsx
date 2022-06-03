import { useState } from "react";
import { start, Transport as t } from "tone";
import { FaPlay, FaPause } from "react-icons/fa";

function Play({ state, handleSetState, song }) {
  const [ready, setReady] = useState(false);

  function initializeAudioContext() {
    start();
    t.position = song.start;
    t.start();
    handleSetState("started");
    setReady(true);
  }

  function startSong() {
    if (state === "started") {
      t.pause();
      handleSetState("paused");
    } else if (state === "stopped") {
      t.start();
      handleSetState("started");
    } else if (state === "paused") {
      t.start();
      handleSetState("started");
    }
  }

  const playerState = (() => {
    switch (t.state) {
      case "stopped":
        return <FaPlay />;
      case "paused":
        return <FaPlay />;
      case "started":
        return <FaPause />;
      default:
        break;
    }
  })();

  return (
    <div>
      {ready ? (
        <button className="button" onClick={startSong}>
          {playerState}
        </button>
      ) : (
        <button className="button" onClick={initializeAudioContext}>
          <FaPlay />
        </button>
      )}
    </div>
  );
}

export default Play;
