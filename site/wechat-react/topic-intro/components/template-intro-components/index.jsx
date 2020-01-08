import * as React from 'react';
import Clipboard from "clipboard";
export class TemplateIntroComponent extends React.Component {
    state = {
        title: '',
        content: '',
        img: '',
        locationHref: ''
    }
    componentDidMount() {
        switch(this.props.type){
            case 'courseIntro': 
                this.setState({
                    title: '模板使用介绍',
                    content: '打开PC直播间管理后台，在课程编辑页面可使用富文本模版。',
                    img: 'https://img.qlchat.com/qlLive/liveComment/4I83LPJI-QPEV-LIFJ-1540451682292-DPINSS65HFE9.jpg?x-oss-process=image/resize,h_400,w_400',
                    locationHref: 'https://mp.weixin.qq.com/s/E4OQq7kw_UwvJ0s4shkBIw'
                })
                break
            case 'headImage':
                this.setState({
                    title: '在线设计头图功能介绍',
                    content: '打开PC直播间管理后台,在课程编辑页即可在线设计头图。',
                    img: 'https://img.qlchat.com/qlLive/liveComment/TRR8MD7R-C6LK-JF9P-1544682650585-Y163ODNMS42I.png?x-oss-process=image/resize,h_400,w_400',
                    locationHref: 'https://mp.weixin.qq.com/s/fSOcCekUttqYhKSrGAbtKw'
                })
                break
        }
        //复制链接
        var clipboard = new Clipboard(".backend-wbesite .copy-url");
        clipboard.on('success', function (e) {
            window.toast('复制成功！');
        });
        clipboard.on('error', function (e) {
            window.toast('复制失败！请手动复制');
        });
        var clipboard2 = new Clipboard(".backend-wbesite .url");
        clipboard2.on('success', function (e) {
            window.toast('复制成功！');
        });
        clipboard2.on('error', function (e) {
            window.toast('复制失败！请手动复制');
        });
    }
    render() {
        return (<div className="template-intro-component_DFDSGD">
                <div className="header">
                    {this.state.title}
                    <span className="close icon_delete" onClick={this.props.hide}></span>
                </div>
                <div className="intro">
                    {this.state.content}
                </div>
                <div className="backend-wbesite">
                    <span className="label">管理后台：</span>
                    <span className="url" data-clipboard-text="https://pc.qlchat.com">https://pc.qlchat.com</span>
                    <span className="copy-url" data-clipboard-text="https://pc.qlchat.com" onClick={this.props.onCopyURL}>复制网址</span>
                </div>
                <div className="img-wrap">
                    <img src={this.state.img}/>
                </div>
                <div className="btn-look" onClick={() => {
            this.props.onClickIntro();
            location.href = this.state.locationHref;
        }}>
                    查看教程
                </div>
            </div>);
    }
}
TemplateIntroComponent.defaultProps = {
    onCopyURL: () => { },
    onClickIntro: () => { }
};
