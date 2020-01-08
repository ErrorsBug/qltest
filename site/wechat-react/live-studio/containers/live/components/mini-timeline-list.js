import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { noShifterParseDangerHtml, locationTo } from 'components/util';

@autobind
class MiniTimeLineList extends Component {
    data = {
        currentIndex: 0
    }

    timer = null;
    timeLineRef = null;

    constructor(props) {
        super(props);
        let timeline = [...props.timeline];
        if(props.timeline.length > 1) {
            timeline = [...timeline, props.timeline[0]]
        }
        this.state = {
            offset: 0,
            timeline: timeline
        }
    }

    componentDidMount() {
       this.genTransition();
    }
    componentWillUnmount() {
        if(this.timer) clearInterval(this.timer);
    }
    
    // 创建滚动动画
    genTransition() {
        if(this.state.timeline.length > 1) {
            const height = document.querySelector('.timeline-bar') && document.querySelector('.timeline-bar').offsetHeight;
            this.timer = setInterval(() => {
                this.data.currentIndex += 1;
                if(this.data.currentIndex >= this.state.timeline.length - 1) {
                    setTimeout(() => {
                        this.timeLineRef.classList.remove('trans');
                        this.data.currentIndex = 0;
                        this.timeLineRef.style.top = (-(this.data.currentIndex * height)) + 'px';
                    },800)
                } else {
                    if(!this.timeLineRef.classList.contains("trans")) {
                        this.timeLineRef.classList.add('trans');
                    }
                }
                this.timeLineRef.style.top = (-(this.data.currentIndex * height)) + 'px';
            },2000);
        }
    }

    /**
     * 点击换一换，修改offset
     */
    async changeHandler() {
        let {
            offset,
            timeline
        } = this.state;
        // let { timeline } = this.props;
        let length = timeline.length

        offset += length;

        if (offset >= length) {
            offset = offset - length;
        }

        this.setState({
            offset
        });
    }

    renderItem(item, index) {
        if (typeof item !== 'object') {
            item = {
                id: '',
                content: '',
                relateTitle: ''
            }
        }
        if (item === null) {
            item = {
                id: '',
                content: '',
                relateTitle: ''
            }
        }
        return (
            <div
                className="news on-log on-visible"
                key={"new-timeline-" + index}

                onClick={this.props.onLinkClick}
                data-log-region="live-timeline"
                data-log-pos="timeline"
                data-log-status={index + 1}
                data-log-name="动态"
                data-log-business_type="tab"
                data-log-business_id="动态-查看全部"
            >
                {
                    item.content && item.content.length > 0 ?
                        <div>
                            <div dangerouslySetInnerHTML={noShifterParseDangerHtml(item.content)}></div>
                        </div>
                        :
                        <div>
                            <div dangerouslySetInnerHTML={noShifterParseDangerHtml(item.relateTitle)}></div>
                        </div>
                }
            </div>
        )
    }

    /**
     * 生成从offset开始的length个
     */
    getItems() {
        return this.state.timeline.map(this.renderItem)
    }

    render() {

        let {
            title,
            // timeline,
            power,
            sysTime,

            onLinkClick,
            onLinkToEdit,
        } = this.props;
        let {
            timeline
        } = this.state;

        if (timeline.length === 0) {
            if (power.allowMGLive) {
                return (
                    <div className="timeline-bar">
                        <div className="tag">{title}</div>
                        <div className="text">
                            <div className="timeline-list">
                                <div className="news">
                                    <span onClick={() => locationTo('/wechat/page/live/timeline/' + this.props.liveId)}>
                                        还没有设置动态，<span className="highlight">点击去设置</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="arrow">
                            <img src={require('../img/arrow.png')} alt=""/>
                        </div>
                    </div>
                )
            } else {
                return null;
            }
        } else {
            return <div className="timeline-bar trans">
                <div className="tag">{title}</div>
                <div className="text">
                    {
                        <div className="timeline-list" ref={ref => {this.timeLineRef = ref}}>
                            { this.getItems() }
                        </div>
                    }
                </div>
                <div className="arrow">
                    <img src={require('../img/arrow.png')} alt=""/>
                </div>
            </div>
        }

    }
}

MiniTimeLineList.propTypes = {
    title: PropTypes.string,
    timeline: PropTypes.array,
    power: PropTypes.object,

    onLinkClick: PropTypes.func,
    onLinkToEdit: PropTypes.func,
};

export default MiniTimeLineList;
