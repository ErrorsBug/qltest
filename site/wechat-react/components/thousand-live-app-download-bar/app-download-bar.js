import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { locationTo, isFromLiveCenter } from 'components/util';
import { autobind } from 'core-decorators';

class AppDownloadBar extends React.Component {

    data = {};

    state = {
        show: false,
        active: false,
    }

    async componentDidMount() {
        if (this.props.isLiveAdmin != '' && this.props.isOfficialLive != '' && this.props.isWhiteLive != '') {
            this.initVisible(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            (this.props.isLiveAdmin == '' || this.props.isOfficialLive == '' || this.props.isWhiteLive == '')
            &&
            (nextProps.isLiveAdmin != '' && nextProps.isOfficialLive != '' && nextProps.isWhiteLive != '')
        ) {
            this.initVisible(nextProps);
        }
    }

    // 判断各种条件决定是否可以显示引导条
    initVisible (data) {

        const hadViewDownloadAppBar = localStorage.getItem('hadViewDownloadAppBar_' + data.topicId);

        // 是否从直播中心进来
        let fromLiveCenter = isFromLiveCenter();


        console.log(`
        是否C端 -- isC: ${data.isC}
        是否从首页进来 -- fromLiveCenter: ${fromLiveCenter}
        是否专业版 -- isLiveAdmin: ${data.isLiveAdmin}
        是否官方直播间 -- isOfficialLive: ${data.isOfficialLive}
        是否白名单 -- isWhiteLive: ${data.isWhiteLive}
        `);

        // 1.首页进来
        // 2.非专业版或官方专业版并且不是白名单直播间
        const canShowBar = !fromLiveCenter && (((data.isLiveAdmin == 'Y' && data.isOfficialLive == 'Y') || data.isLiveAdmin == 'N') && data.isWhiteLive === 'N')

        const show = data.isC && canShowBar && (!hadViewDownloadAppBar || hadViewDownloadAppBar < 1);

        if (show) {
            this.setState({ show })
            setTimeout(() => {
                this.show();
            }, 2000)
        }
    }

    // 做弹出动画
    show() {
        this.setState({
            active: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    active: false,
                });

                let hadViewDownloadAppBar = Number(localStorage.getItem('hadViewDownloadAppBar_' + this.props.topicId)) || 0
                console.log('hadViewDownloadAppBar  ', hadViewDownloadAppBar);
                if (hadViewDownloadAppBar >= 1) {
                    setTimeout(() => {
                        this.setState({
                            show: false
                        })
                    }, 600);
                }
            }, 3000);
        });
    }

    popUp() {
        let hadViewDownloadAppBar = Number(localStorage.getItem('hadViewDownloadAppBar_' + this.props.topicId)) || 0
        localStorage.setItem('hadViewDownloadAppBar_' + this.props.topicId, hadViewDownloadAppBar + 1)

        if (this.state.active === true) {
            return;
        }
        
        this.show(hadViewDownloadAppBar);
    }

    locatePage() {
        locationTo('http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1390837667111')
    }
    
    render () {
        if (!this.state.show) {
            return null;
        }

        return (
            <div className={'app-download-bar-container ' + this.props.style}>
                <div className={classnames('app-download-bar', { 'active': this.state.active })}>
                    <img onClick={this.popUp.bind(this)} className='pop-out' src={require('./img/app-icon.png')} alt=""/>
                    <span
                        onClick={this.locatePage.bind(this)}
                        className='pop-text on-log'
                        data-log-region="top-pop-bar"
                        data-log-pos="app-download"
                    >
                        下载APP听课
                    </span>
                </div>
            </div>
        );
    }
}

const YorN = PropTypes.oneOf(['Y', 'N', '']);
const ID = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
])

AppDownloadBar.propTypes = {
    // 直播间ID
    liveId: ID.isRequired,
    // 话题ID
    topicId: ID,
    // 是否专业版
    isLiveAdmin: YorN.isRequired,
    // 是否官方直播间
    isOfficialLive: YorN.isRequired,
    // 是否白名单直播间
    isWhiteLive: YorN.isRequired,
    // 是否C端
    isC: PropTypes.bool,
    // 话题类型
    topicType: PropTypes.string,
    // 自定样式
    style: PropTypes.string,
}

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(AppDownloadBar);
