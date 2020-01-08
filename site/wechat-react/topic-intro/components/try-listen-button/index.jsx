import React from "react";

export default function TryListenButton({
    // content = "送你一节，免费听",
    onClick = () => {}
}) {
    return (
        <div className="try-listen-button" onClick={onClick}>
            <img
                className="icon-play"
                src={require("./assets/icon-play.svg")}
            />
            {/* <span>{content}</span> */}
        </div>
    );
}
