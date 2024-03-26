import React from "react";
import HideScrollBar from "@/css/HideScrollBar";

/**
 * 
 * @param name adds a title above the item list
 * @param children is the items to include in the list
 */
export default function SearchItemList({ name, children }: { name?: string, children: React.ReactNode }): React.ReactElement {
    return (
        <div>
            {
                name ? 
                    <><h2 style={{display: "inline-block"}}>{ name }</h2><span style={{borderTop: "2px solid black", width: "50%", marginLeft: "0.5rem", display: "inline-block"}}></span></>:
                    null
            }
            <div style={{display: "flex", flexWrap: "nowrap", overflowX: "scroll"}}>
                {children}
            </div>
        </div>
    );
}