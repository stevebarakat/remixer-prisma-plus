import React from "react";
import { StyleSheet, css } from "aphrodite";

const loadKeyframes = {
  "0%": {
    boxShadow: "0 2.5em 0 -1.3em",
  },
  "80%": {
    boxShadow: "0 2.5em 0 -1.3em",
  },
  "100%": {
    boxShadow: "0 2.5em 0 -1.3em",
  },
  "40%": {
    boxShadow: "0 2.5em 0 0",
  },
};

const base = {
  borderRadius: "50%",
  width: "2.5em",
  height: "2.5em",
  animationFillMode: "both",
  animationName: loadKeyframes,
  animationDuration: "1.8s",
  animationIterationCount: "infinite",
  animationTimingFunction: "ease-in-out",
  animationDelay: "initial",
  animationDirection: "initial",
  animationPlayState: "initial",
};
const beforeAfter = {
  content: "''",
  position: "absolute",
  top: 0,
};

const styles = StyleSheet.create({
  loader: {
    ...base,
    color: "white",
    fontSize: "10px",
    margin: "80px auto",
    position: "relative",
    textIndent: "-9999em",
    transform: "translateZ(0)",
    animationDelay: "-0.16s",
    ":before": {
      ...base,
      ...beforeAfter,
      left: "-3.5em",
      animationDelay: "-0.32s",
    },
    ":after": {
      ...base,
      ...beforeAfter,
      left: "3.5em",
    },
  },
});

const Loader = () => {
  return <div className={css(styles.loader)} />;
};

export default Loader;
