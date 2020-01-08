import * as React from 'react';
import './style.scss'
interface Props {
    content: string;
    show: boolean;
    clickHandle: any;
    type?: string;
}

function TuiwenMask({content, show, clickHandle, type}: Props) {
    return (
        show ? <div 
            className="tuiwen-mask-bg"
            onClick={clickHandle}
        >
            <main className="on-top">
                <div className="share-tips"> 
                    点击页面右上角 ···  分享到朋友圈，{content}
                </div>
            </main>
        </div> : ""
    );
}



export default TuiwenMask;