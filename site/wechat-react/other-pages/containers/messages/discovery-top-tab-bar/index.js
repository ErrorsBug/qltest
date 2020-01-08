import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getLearnEverydayNewData } from '../../../actions/live';


@withRouter
class DiscoveryTopTabBar extends React.Component {
    state = {
        config: [
            // {
            //     name: '订阅',
            //     attrs: {
            //         // 'data-log-region': 'top-tab-messages',
            //     },
            //     redPoint: true
            // },
            {
                name: '互动提醒',
                attrs: {
                    'data-log-region': 'top-tab-messages',
                },
            },
            {
                name: '关注的动态',
                attrs: {
                    'data-log-region': 'top-tab-timeline',
                },
            },
        ],
        isHaveNewDataInLearnEveryday: 'N',//每天学是否有最新信息
    }

    componentDidMount(){
        this.isHaveNewDataInLearnEveryday()
    }

    isHaveNewDataInLearnEveryday = async() => {
        let isHaveNewDataInLearnEveryday = await getLearnEverydayNewData()
        this.setState({isHaveNewDataInLearnEveryday})
    }

    render() {
        return (
            <div className="p-discovery-top-tab-bar">
                {
                    this.state.config.map((item, index) => {
                        return <div key={index}
                            className={`tab-item on-log${index == this.props.activeIndex ? ' active' : ''}${item.redPoint && this.state.isHaveNewDataInLearnEveryday == 'Y' ? ' new': ''}`}
                            onClick={() => this.onClickItem(index)}
                            {...item.attrs}
                        >
                            <p>{item.name}
                                {
                                    item.unread && <span>{item.unread}</span>
                                }
                            </p>
                        </div>
                    })
                }
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeIndex >= 0 && this.props.activeIndex !== nextProps.activeIndex) {
            this.onClickItem(nextProps.activeIndex);
        }
    }

    onClickItem(index) {
        setTimeout(() => {
            if (index == 0) {
                this.props.router.push('/wechat/page/messages');
            } else if (index == 1) {
                this.props.router.push('/wechat/page/timeline');
            } 
        }, 10)
    }
}


export default connect(state => state, {
})(DiscoveryTopTabBar);