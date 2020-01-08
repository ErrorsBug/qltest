// 带有“每天学”的顶部导航条，目前适用于“我的关注”，“我的足迹”，“每天学”三个页面
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {getLearnEverydayNewData} from '../../other-pages/actions/live';
import PropTypes from 'prop-types';

@withRouter
class LearnEverydayTopTabBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isHaveNewDataInLearnEveryday: 'N'//每天学是否有最新信息
        }
    }

    async componentDidMount(){
        this.isHaveNewDataInLearnEveryday()
    }

    // 判断每天学页面是否更新有新的信息
    isHaveNewDataInLearnEveryday = async() => {
        // 在每天学页面不需要请求
        if(this.props.dontFetch){
            return
        }
        let isHaveNewDataInLearnEveryday = await getLearnEverydayNewData()
        this.setState({isHaveNewDataInLearnEveryday})
    }

    render() {
        return (
            <div className="top-tab-bar">
                {
                    this.props.config.map((item, index) => {
                        return <div key={index}
                            className={`tab-item on-log${index == this.props.activeIndex ? ' active' : ''}`}
                            onClick={() => this.onClickItem(index)}
                            {...item.attrs}
                        >
                            <p>{item.name}
                                {/* {
                                    item.unread && <span>{item.unread}</span>
                                } */}
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
        // 如果跳转地址是当前地址则不用跳转。
        var regStr=new RegExp(window.location.pathname)
        if (regStr.test(this.props.config[index].href)) {
            return;
        }
        setTimeout(() => {
            this.props.router.push(this.props.config[index].href)
        }, 10)
    }
}
LearnEverydayTopTabBar.propTypes = {
    // 是否需要请求显示红点的接口
    dontFetch: PropTypes.bool,
    // 页面当前选中的tabbar，
    activeIndex: PropTypes.number.isRequired,  
    // tabbar文案，跳转链接的数组 
    config: PropTypes.array.isRequired,
};

export default connect(state => state, {
})(LearnEverydayTopTabBar);