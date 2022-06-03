import React from "react";
import styled from "styled-components";

import useBoundingBox from "../hooks/use-bounding-box-v2.hook";
import {
  clamp,
  clampedNormalize,
  convertCartesianToPolar,
  convertRadiansToDegrees,
  roundToNearest,
} from "../utils/utils";

// import AngleBackground from "./AngleBackground";

const OUTER_BORDER_WIDTH = 3;

function AngleControl({ angle, precision = 5, setAngle }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [inputMode, setInputMode] = React.useState("pointer");

  const wrapperRef = React.useRef();

  const box = useBoundingBox(wrapperRef);

  React.useEffect(() => {
    if (!isDragging) {
      return;
    }

    function handleMouseUp(ev) {
      setIsDragging(false);
    }

    function handleMouseMove(ev) {
      // For some funky reason, a mousemove event is triggered on
      // iOS Safari when the user stops dragging and taps another
      // element.
      //
      // HACK: Bail if we're doing this on an iOS device, according
      // to the UA.
      // const isMobileSafari =
      //   navigator.userAgent.match(/iPad/i) ||
      //   navigator.userAgent.match(/iPhone/i);

      // if (isMobileSafari) {
      //   return;
      // }

      const newAngle = deriveAngleFromMousePosition(ev, box, precision);
      setAngle(newAngle);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, box]);

  function handleStartDragging(ev) {
    ev.preventDefault();
    setIsDragging(true);

    const newAngle = deriveAngleFromMousePosition(ev, box, precision);
    setAngle(newAngle);
  }

  function handleKeyDown(ev) {
    if (!ev.key.match(/^Arrow/)) {
      return;
    }

    ev.preventDefault();
    setInputMode("keyboard");

    const newAngle = deriveAngleFromKeyArrow(ev.key, angle);
    setAngle(newAngle);
  }

  return (
    <div
      label="Angle"
      labelAs="span"
      cornerContents={<div value={angle} renderer={(value) => `${value}deg`} />}
    >
      <Wrapper
        ref={wrapperRef}
        onMouseDown={handleStartDragging}
        onTouchStart={handleStartDragging}
      >
        <Background>
          {box && (
            <div
              width={box.width}
              height={box.width}
              borderWidth={OUTER_BORDER_WIDTH}
            />
          )}
        </Background>
        <VisualizationWrapper>
          <Svg viewBox="0 0 200 200">
            <circle />
          </Svg>
        </VisualizationWrapper>
        <NeedleWrapper style={{ "--rotation": angle + "deg" }}>
          <Needle onKeyDown={handleKeyDown} />
        </NeedleWrapper>

        <NeedleCap />
      </Wrapper>
    </div>
  );
}

function deriveAngleFromMousePosition(ev, box, precision) {
  let x, y;

  if (ev.touches) {
    const touch = ev.touches[0];
    [x, y] = [touch.clientX, touch.clientY];
  } else {
    [x, y] = [ev.clientX, ev.clientY];
  }

  const relativeX = x - box.left;
  const relativeY = y - box.top;

  const centerX = box.width / 2;
  const centerY = box.height / 2;

  const [theta] = convertCartesianToPolar(
    [relativeX, relativeY],
    [centerX, centerY]
  );

  let angle = convertRadiansToDegrees(theta);

  // By default, our resulting angle is 90-degrees off.
  angle = (angle + 90) % 360;

  // In order to make it easier to select typical values like 90
  // degrees, we'll round to a given increment. By default, 5.
  // This means you can select 85, 90, 95. But not 89 or 91.
  angle = roundToNearest(angle, precision);

  // Avoid haviung both 360 and 0.
  if (angle === 360) {
    angle = 0;
  }

  return angle;
}

function deriveAngleFromKeyArrow(arrow, angle) {
  switch (arrow) {
    case "ArrowUp": {
      // Ignore when we're at the extremes
      if (angle === 0) {
        return angle;
      } else if (angle >= 355) {
        return 0;
      }

      return angle < 180
        ? clamp(angle - 5, 0, 180)
        : clamp(angle + 5, 180, 355);
    }

    case "ArrowDown": {
      if (angle === 180) {
        return angle;
      }

      return angle < 180
        ? clamp(angle + 5, 0, 180)
        : clamp(angle - 5, 180, 355);
    }
    case "ArrowLeft": {
      if (angle === 270) {
        return angle;
      }
      if (angle < 5) {
        return angle + 355;
      }

      if (angle >= 0 && angle < 90) {
        return clamp(angle - 5, 0, 90);
      } else if (angle >= 90 && angle < 270) {
        return clamp(angle + 5, 90, 270);
      } else {
        return clamp(angle - 5, 270, 360);
      }
    }
    case "ArrowRight": {
      if (angle === 90) {
        return angle;
      }
      if (angle >= 355) {
        return angle - 355;
      }

      if (angle >= 0 && angle < 90) {
        return clamp(angle + 5, 0, 90);
      } else if (angle >= 90 && angle < 270) {
        return clamp(angle - 5, 90, 270);
      } else {
        return clamp(angle + 5, 270, 360);
      }
    }
  }
}

const Wrapper = styled.div`
  position: relative;
  touch-action: none;
  /*
    When dragging the angle, the box rotates.
    This can lead to a scrollburglar, because the corners of the
    box peek out beyond the container.
  */
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const VisualizationWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  vector-effect: non-scaling-stroke;
`;

const NeedleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotate(var(--rotation));
  transform-origin: center center;
`;

const Needle = styled.button`
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  width: 5px;
  height: 60%;
  margin-left: auto;
  margin-right: auto;
  background: white;
  border-radius: 1000px;

  &:focus-visible {
    outline-offset: 4px;
    outline-color: white;
  }
`;

const NeedleCap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  margin: auto;
  border-radius: 50%;
  background: var(--color-gray-300);
  border: 2px solid var(--color-background);
  /* background: conic-gradient(
    from 180deg at 50% 50%,
    hsl(0deg 0% 80%) 0deg,
    hsl(0deg 0% 94%) 63.75deg,
    hsl(0deg 0% 75%) 112.5deg,
    hsl(0deg 0% 98%) 178.12deg,
    hsl(0deg 0% 78%) 243.75deg,
    hsl(0deg 0% 90%) 290.63deg,
    hsl(0deg 0% 80%) 360deg
  ); */
`;

export default React.memo(AngleControl);
