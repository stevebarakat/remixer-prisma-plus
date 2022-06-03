import { FaBackward } from "react-icons/fa";
import { Transport as t } from "tone";

function Rewind({ startTime, startPosition }) {
  function rew() {
    if (parseInt(t.position, 10) < 10) {
      t.position = startPosition;
    } else {
      t.position = startPosition - startTime.current - 10;
      startTime.current += 10;
    }
  }

  return (
    <button className="button" onClick={rew}>
      <FaBackward />
    </button>
  );
}

export default Rewind;
