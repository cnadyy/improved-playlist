import { CSSProperties } from "react";

const HideScrollBar: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  // @ts-expect-error psudeo elements arent typed
  "&::WebkitScrollbar": { display: "none" },
};

export default HideScrollBar;
