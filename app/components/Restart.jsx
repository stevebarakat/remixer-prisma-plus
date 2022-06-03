import { FaStepBackward } from "react-icons/fa";
import { Transport as t } from "tone";

function Restart({ song, startTime }) {
  function restart() {
    t.position = song.start;
    startTime.current = song.start;
  }

  return (
    <button className="button" onClick={restart}>
      <FaStepBackward />
    </button>
  );
}

export default Restart;
