import { FaForward } from "react-icons/fa";
import { Transport as t } from "tone";

function FastFwd({ startTime, startPosition, endPosition, currentTime }) {
  function ff() {
    if (t.seconds > endPosition - 10) {
      t.seconds = endPosition;
      startTime.current = startPosition;
    } else {
      t.position = currentTime.current - startTime.current + 10;
      startTime.current -= 10;
    }
  }

  return (
    <button className="button" onClick={ff}>
      <FaForward />
    </button>
  );
}

export default FastFwd;
