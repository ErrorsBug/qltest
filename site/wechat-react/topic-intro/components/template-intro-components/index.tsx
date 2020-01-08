import * as React from 'react';
import Clipboard from "clipboard";

export class TemplateIntroComponent extends React.Component<{
    onCopyURL: () => void;
    onClickIntro: () => void;
},{}> {

    componentDidMount () {
        //复制链接
        var clipboard = new Clipboard(".backend-wbesite .copy-url");   
        clipboard.on('success', function(e) {
            (window as any).toast('复制成功！');
        });  
        clipboard.on('error', function(e) { 
            (window as any).toast('复制失败！请手动复制');
        });

        var clipboard2 = new Clipboard(".backend-wbesite .url");   
        clipboard2.on('success', function(e) {
            (window as any).toast('复制成功！');
        });  
        clipboard2.on('error', function(e) { 
            (window as any).toast('复制失败！请手动复制');
        });
    }

    render () {
        return (
            <div className="template-intro-component_DFDSGD">
                <div className="header">
                    模版使用介绍
                </div>
                <div className="intro">
                    打开PC直播间管理后台，在课程编辑页面即可使用富文本模版
                </div>
                <div className="backend-wbesite">
                    <span className="label">管理后台网址：</span>
                    <span className="url" data-clipboard-text="http://v.qianliao.tv">v.qianliao.tv</span>
                    <span className="copy-url" data-clipboard-text="http://v.qianliao.tv" onClick={this.props.onCopyURL}>复制网址</span>
                </div>
                <div className="img-wrap">
                    <img src="https://img.qlchat.com/qlLive/liveComment/4I83LPJI-QPEV-LIFJ-1540451682292-DPINSS65HFE9.jpg?x-oss-process=image/resize,h_400,w_400" />
                </div>
                <div className="btn-look" onClick={() => {
                    this.props.onClickIntro()
                    location.href = 'https://mp.weixin.qq.com/s/E4OQq7kw_UwvJ0s4shkBIw'
                }}>
                    查看教程
                </div>
            </div>
        )
    }

    static defaultProps = {
        onCopyURL: () => {},
        onClickIntro: () => {}
    }
}