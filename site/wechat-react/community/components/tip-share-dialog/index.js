import React, { PureComponent,Fragment } from 'react' 

 
export const ShowLink = ({text}) => (
    <div className="fl-dialog-link-container">
        <div className="fl-dialog-link">
            <div style={{marginBottom:'4px'}}>点击右上角 <span></span><span></span><span></span></div>
            <div>{text||'请闺蜜好友当见证人'}</div>
        </div>
    </div>
) 
export const ShowImg = () => (
    <div className="fl-dialog-link-container">
        <div className="fl-dialog-link fl-dialog-poster">
            <div className="fl-icon">
                <img src="https://img.qlchat.com/qlLive/business/4GNL3IE5-JJ9X-A5T5-1558942712790-5DPX58RYAYN6.png"/>
            </div>
            <div className="fl-right-path">
                <div style={{marginBottom:'4px'}}>长按图片保存</div>
                <div>或直接发送给好友</div>
            </div>
        </div>
    </div>
)
 