import * as React from "react";

interface Props {
    num: number;
    businessId: string;
    businessType: string;
}

class TopOptimizeBar extends React.Component<Props, {
    show: boolean
}> {
    state = {
        show: true
    }
    render () {
        let {
            num,
            businessId,
            businessType,
        } = this.props;
        if (!num) return null;
        let waitOptimize = JSON.parse(localStorage.getItem('wait-optimized'));
        if (!waitOptimize) waitOptimize = [];
        if (waitOptimize.find((item) => {
            return item.businessId == businessId && item.businessType == businessType;
        })) return null;
        if (!this.state.show) return null;
        return (
            <div className="top-optimized-bar_FDSGA">
                <div className="flex-1">
                    <img src="https://img.qlchat.com/qlLive/liveComment/PNZ7XFGV-O1WA-ELRO-1556182183834-QOXPSQ2ATQ2T.png?x-oss-process=image/resize,h_400,w_400" />
                    <span>该课程有{num}个待优化点</span>
                </div>
                <div className="look-up" style={{
                    marginRight: 40
                }} onClick={() => {
                    location.href = `/wechat/page/live-promote-method?businessId=${businessId}&businessType=${businessType}`
                }}>
                    查看
                </div>
                <div className="close" onClick={() => {
                    waitOptimize.push({
                        businessId,
                        businessType
                    })
                    localStorage.setItem('wait-optimized', JSON.stringify(waitOptimize))
                    this.setState({
                        show: false
                    })
                }}>
                    <img src={require('./assets/close.svg')} />
                </div>
            </div>
        );
    }

    static defaultProps = {
        num: 0
    }
}

export default TopOptimizeBar;
