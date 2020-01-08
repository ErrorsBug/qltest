import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { collectVisible } from 'components/collect-visible';
import Redpoint from "components/redpoint";

@autobind
class FunctionMenu extends Component {

    state = {
        showWrap: false,
        showContent: false,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.functionMenuVisible !== this.props.functionMenuVisible) {
            this.handleVisibleAnimation(nextProps.functionMenuVisible)
        }
    }

    animationTime = 350

    handleVisibleAnimation(visible) {
        if (visible) {
            this.setState({ showWrap: true }, () => {
                this.setState({ showContent: true }, () => {
                    collectVisible()
                })
            })
        } else {
            this.setState({ showContent: false })
            setTimeout(() => {
                this.setState({ showWrap: false })
            }, this.animationTime);
        }

    }
    

    get menus() {
        const liveId = this.props.liveId
        let list = [
            {
                imgSrc: require('./img/create-topic.png'),
                text: '单课',
                url: `/wechat/page/topic-create?liveId=${liveId}`,
                className:'create-topic',
                region: "create-topic",
            },
            {
                imgSrc: require('./img/create-channel.png'),
                text: '系列课',
                url: `/wechat/page/channel-create?liveId=${liveId}`,
                className:'create-channel',
                region:'create-channel',
            },
            {
                imgSrc: require('./img/create-punch-card.png'),
                text: '打卡',
                url: `/wechat/page/check-in-camp/new-camp/${liveId}`,
                className: 'create-punch-card',
                region:'create-camp',
            },
            {
                imgSrc: require('./img/create-knowledge.png'),
                text: '短知识',
                url: `/wechat/page/short-knowledge/create?liveId=${liveId}`,
                className: 'create-knowledge',
                region: "CreateShortvideo",
            },
            {
                imgSrc: require('./img/knowmall.png'),
                text: '转载课',
                url: `/wechat/page/live-studio/media-market?selectedLiveId=${liveId}`,
                className: 'knowmall',
                region:'media-market',
            },
        ]

        return list
    }

    render() {
        const { showFunctionMenu, functionMenuVisible } = this.props

        return (
            <div>
                {
                    this.state.showWrap &&
                    <div className='comp-live-function-menu'>
                        <div className="bg" onClick={() => { showFunctionMenu(false) }}></div>
                        <ReactCSSTransitionGroup
                            transitionName="function-menu-animation-dialog"
                            transitionEnterTimeout={this.animationTime}
                            transitionLeaveTimeout={this.animationTime}>
                            {
                                this.state.showContent &&            
                                <div className="dialog">
                                    <div className="title">新建课程</div>
                                    <div className="content">
                                        {
                                            this.menus.map((item, index) => {
                                                return <div
                                                    className="function-menu on-log on-visible"
                                                    key={`menu-${index}`}
                                                    data-log-region={item.region||''}
                                                    onClick={() => { location.href = item.url }}
                                                >
                                                    <img src={item.imgSrc} alt="" />
                                                    <span>{item.text}</span>
                                                    {
                                                        item.text ==='短知识' && 
                                                        <Redpoint pointContent='new'
                                                        pointStyle={'font-red-point'}
                                                        pointWrapStyle="function-red" 
                                                        // pointNpval={`短知识`} 
                                                        />
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className="close" onClick={() => { showFunctionMenu(false) }}><img src={require('./img/close.png')} alt=""/></div>
                                </div>
                            }
                        </ReactCSSTransitionGroup>
                    </div>
                }
            </div>
        );
    }
}

FunctionMenu.propTypes = {
    liveId: PropTypes.string.isRequired,
    showFunctionMenu: PropTypes.func.isRequired,
    functionMenuVisible: PropTypes.bool.isRequired,
};

export { FunctionMenu };
