import { CSSProperties } from "react";

const HideScrollBar: CSSProperties = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    // @ts-ignore
    "&::WebkitScrollbar": { display: "none"},
}

export default HideScrollBar;
