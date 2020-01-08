import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { locationTo } from 'components/util';

class LinkNoFound extends Component {
    state = {
        notFoundTips: '',
        backToTips: '',
        backSecond:6
    }
    
    componentWillMount() {
         this.initTips();
    }
    

    componentDidMount() {
        // this.initTips();
        this.startTimer();
    }




    /**
     * 初始化页面提示
     * 
     * @memberof LinkNoFound
     */
    initTips() {
        let type = this.props.location.query.type || 'none';
        switch (type){
            case 'topic':
                this.setState({
                    notFoundTips : '此话题不存在或者已经被删除',
                    backToTips : this.props.location.query.liveId?'直播间首页':'个人中心',
                })
                break;
            case 'topicOut':
                this.setState({
                    notFoundTips : '你已被踢出该话题',
                    backToTips : this.props.location.query.liveId?'直播间首页':'个人中心',
                });
                break;
            case 'channelOut':
                this.setState({
                    notFoundTips : '你已被踢出该系列课',
                    backToTips : this.props.location.query.liveId?'直播间首页':'个人中心',
                });
                break;
            case 'campOut':
                this.setState({
                    notFoundTips : '你已被踢出该训练营',
                    backToTips : this.props.location.query.liveId?'直播间首页':'个人中心',
                });
                break;
            case 'notMg':
                this.setState({
                    notFoundTips : '没有权限访问',
                    backToTips : '个人中心',
                });
                break;
            default:
                this.setState({
                    notFoundTips : '该链接已经失效',
                    backToTips : '个人中心',
                });
                
                break;
            
        }
    }
    


    /**
     *  跳转倒计时 
     * 
     * @memberof LinkNoFound
     */
    startTimer() {
        
        if(this.state.backSecond > 1 ){
            this.setState({
                backSecond:this.state.backSecond - 1
            })
            setTimeout(()=>{
                this.startTimer();
            },1000)
        }else{
            this.linkToPage();
        }
    }


    /**
     * 跳转页面
     * 
     * @memberof LinkNoFound
     */
    linkToPage(){
        let type = this.props.location.query.type || 'none';
        switch (type){
            case 'topic':
            case 'topicOut':
            case 'channelOut':
            case 'campOut':
                if(this.props.location.query.liveId){
                    locationTo(
                        `/live/${this.props.location.query.liveId}.htm`,
                        `/pages/live-index/live-index?liveId=${this.props.location.query.liveId}`
                    );
                }else{
                    locationTo(
                        '/wechat/page/mine',
                        '/pages/index/index?key=mine'
                    );
                }
                break;
            default:
                    locationTo(
                        '/wechat/page/mine',
                        '/pages/index/index?key=mine'
                    );
                break;
        }
    }


    render() {
        return (
            <Page  title='链接失效'  className="link-not-found">
                <div className="main">
                    <img className='icon-rocket' src="//img.qlchat.com/qlLive/liveCommon/overduepic-1.png" />
                    <span className="tips-one">{this.state.notFoundTips}</span>
                    <span className="tips-two">{this.state.backSecond}秒钟后将返回{this.state.backToTips}</span>
                </div>
                <div className="bottom_msg">有任何问题，请报告给【千聊公众号】</div>
            </Page>

        );
    }
}

LinkNoFound.propTypes = {

};

function mapStateToProps(state) {
    return {
        
    };
}
const mapDispatchToProps = {
};
module.exports = connect(mapStateToProps, mapDispatchToProps)(LinkNoFound);