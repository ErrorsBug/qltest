import React, { useRef } from "react";
import CanvasVideoPlayer from "../canvas-video-player";

import './style.scss';

const GuideVideo = ({ className, src, poster }) => {
    const canvasVideoPlayerRef = useRef(null);

    return (
        <div className={`guide-video ${className ? className : ""}`}>
            <CanvasVideoPlayer
                hideTime={true}
                hidePlaybackRate={true}
                hideProgress={true}
                isLive={false}
                className="video-box"
                poster={poster}
                ref={canvasVideoPlayerRef}
                src={src}
            />
        </div>
    );
};

export default GuideVideo;
