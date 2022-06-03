import React from "react";

function SoloMute({ channel, track, handleSetIsMuted }) {
  return (
    <div className="solo-mute">
      <input
        id={`solo${track.path}`}
        type="checkbox"
        onChange={(e) => {
          channel.set({ solo: e.target.checked });
        }}
      />
      <label className="label" htmlFor={`solo${track.path}`}>
        S
      </label>
      <input
        id={`mute${track.path}`}
        type="checkbox"
        onChange={(e) => {
          channel.set({ mute: e.target.checked });
          handleSetIsMuted(e.target.checked);
        }}
      />
      <label className="label" htmlFor={`mute${track.path}`}>
        M
      </label>
    </div>
  );
}

export default SoloMute;
