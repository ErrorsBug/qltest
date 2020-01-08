import * as React from 'react';
import './style.scss'
interface Props {
    imgSrc: string;

    mark?: string;
    linkUrl?: string;
    clickHandle?: any;
}

function TuiwenImageItem({ imgSrc, mark, linkUrl, clickHandle }: Props) {
    return (
        <div 
            className="tuiwen-image-item"
            onClick={clickHandle}
        >
            <img src={imgSrc} alt=""/>
        </div>
    );
}

export default TuiwenImageItem;