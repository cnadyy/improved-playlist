import { CSSProperties } from "react";

const lineClamp: CSSProperties = {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
};

export default lineClamp;
