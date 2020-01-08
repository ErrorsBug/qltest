import React from 'react';
import Picture from 'ql-react-picture';
import ScrollView from 'components/scroll-view';




export default class OtherVideosBox extends React.PureComponent {
    render() {
        return <div className="sk-ovs-box" onClick={this.props.onClose}>
            <div className="header-bar">
                <i className="icon_cross"></i>
            </div>

            <ScrollView
                onScrollBottom={() => this.props.getData(true)}
            >
            {
                this.props.data && this.props.data.map((item, index) => {
                    const isCurrent = item.id == this.props.currentId;

                    return <div key={index}
                        className={`sk-item${isCurrent ? ' current' : ''}`}
                    >
                        <div className="snapshot"
                            onClick={(e) => {
                                if (!isCurrent) {
                                    e.stopPropagation();
                                    this.props.goToOtherKnowledge(item.id);
                                }
                            }}
                        >
                            <Picture placeholder resize={{m: 'lfit', w: 200}} src={item.coverImage} />
                        </div>
                        <div className="name">{item.name}</div>
                    </div>
                })
            }

            {
                this.props.status !== 'end' || !this.props.qlchatQrcode && this.renderStatus()
            }

            {
                this.props.status === 'end' && !!this.props.qlchatQrcode &&
                <div className="qrcode">
                    <div className="img-wrap">
                        <img src={this.props.qlchatQrcode} />
                        <p>关注作者公众号</p>
                        <p>第一时间看最新视频</p>
                    </div>
                </div>
            }
            </ScrollView>
        </div>
    }

    renderStatus() {
        if (this.props.status === 'pending') return <div className="load-status"><span>加载中<span className="co-loading-ellipsis"></span></span></div>
        if (this.props.status === 'end') return <div className="load-status"><span>到底了~</span></div>
        return false
    }
}