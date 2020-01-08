import * as React from 'react';
import './style.scss'
interface Props {
    VideoSrc: string;
}

function TuiwenVideoItem({VideoSrc}: Props) {
    return (
        <div className="video-container">
            <iframe frameBorder="0" width="640" height="498" src={VideoSrc} allowFullScreen></iframe>
        </div>
    );
}

export default TuiwenVideoItem;
