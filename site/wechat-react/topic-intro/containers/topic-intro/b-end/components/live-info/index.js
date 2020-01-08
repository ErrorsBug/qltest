import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import BtnFollowLive from './btn-follow-live';
import { autobind } from 'core-decorators';

import { locationTo } from 'components/util';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import LiveVDialog from 'components/dialogs-colorful/live-v';


@autobind
class LiveInfo extends Component {

    state = {
        
        //实名认证弹框是否显示
        isShowRealName: false,
        // 官方认证显示弹框
        isShowVBox:false,
        
        showFollow: false,
        
        realNameStatus:'',
    }
    
    data = {
        // 已经获取过数据
        isGetStatus: false,
        // 某些官方直播间不展示关注人数
        superLiveIds:['100000081018489' ,'350000015224402' ,'310000089253623' ,'320000087047591' ,'320000078131430' ,'290000205389044']
    }

    componentDidMount() {
        this.initShowFollow();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.liveRole != 'creater' && nextProps.liveRole == 'creater') {
            this.getRealStatus();
        }
    }

    initShowFollow() {
        const superLiveId = new Set(this.data.superLiveIds);
        if (!superLiveId.has(this.props.topicInfo.liveId)) {
            this.setState({
                showFollow: true,
            })
        }
    }

    //实名认证的按钮点击事件
    handleRealNameBtnClick(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            isShowRealName : true,
        });
    }

    closeRealName(){
        this.setState({
            isShowRealName : false,
        });
    }

    // 获取实名进度
    async getRealStatus() {
        const { data } = await this.props.getRealStatus(this.props.topicInfo.liveId, 'topic');
        const res = await this.props.getCheckUser();
        const newReal = (res.data && res.data.status) || 'no';
        const oldReal = data.status || 'unwrite';
        this.setState({
            verifyStatus: newReal,
            realNameStatus: oldReal,
        });
    }
    

    //加v的按钮点击事件
    handleVClick(e){
        e.stopPropagation();
        e.preventDefault();

        if (!this.props.power.allowMGTopic) {
            return false;
        }

        this.setState({
            isShowVBox : true,
        });
    }

    closeVBox(){
        this.setState({
            isShowVBox : false,
        });
    }

    render() {
        return (
            <div className='live-info-container'>
                {this.props.groupComponent}
                <div className="top">
                    <img className='logo' onClick={()=>{locationTo(`/wechat/page/live/${this.props.topicInfo.liveId}${this.props.auditStatus ? '?auditStatus=' + this.props.auditStatus : ''}`)}} src={(this.props.topicInfo.liveLogo || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')+'?x-oss-process=image/resize,m_fill,limit_0,h_50,w_50 '} />  
                    <span className="live-name"  onClick={()=>{locationTo(`/wechat/page/live/${this.props.topicInfo.liveId}${this.props.auditStatus ? '?auditStatus=' + this.props.auditStatus : ''}`)}} >{this.props.topicInfo.liveName}</span>
                    <span className="btn-container">
                        <BtnFollowLive />    
                    </span>
                </div>
                <div className="center">
                    <span className="item">
                        <span className="count">{this.props.liveInfo.allTopicNum || 0}</span>
                        <span className="name">话题数</span>
                    </span>   
                    {
                        this.state.showFollow && 
                        <span className="item">
                            <span className="count">{this.props.liveInfo.followNum || 0}</span>
                            <span className="name">关注人数</span>
                        </span>   
                    }

                    <span className="item">
                    {
                        this.props.liveRole == 'creater' &&
                        <span className="symbol-item" onClick={this.handleRealNameBtnClick} ><i className={`${this.state.verifyStatus == 'pass' ? 'real-name' : 'real-name-n'}`}></i>实名认证</span>
                    }  
                    {
                        this.props.liveInfo.symbolList ?
                            this.props.liveInfo.symbolList.filter(item => (item.key == 'livev')).map((val, index) => {
                                return <span className="symbol-item" onClick={this.handleVClick} key={index} ><i className='livev'></i>官方认证</span>
                            })
                        : 
                            null        
                    } 
                        
                    </span>
                </div>

                {/* 实名认证弹框  */}
                {
                    (typeof (document) != 'undefined') ?
                        createPortal(
                            <NewRealNameDialog 
                                show = { this.state.isShowRealName }
                                onClose = {this.closeRealName}
                                realNameStatus = { this.state.realNameStatus || 'unwrite'}
                                checkUserStatus = { this.state.verifyStatus }
                                isClose={ true }
                                liveId = {this.props.topicInfo.liveId}/>
                            ,
                            document.getElementById('app')
                        )
                    :null 
                }
                {/* 直播间加V  */}
                {
                    (typeof (document) != 'undefined') ? createPortal(
                        <LiveVDialog
                            show = {this.state.isShowVBox}
                            onClose={this.closeVBox}
                        />,
                        document.getElementById('app')
                    )
                    :null    
                }
            </div>
        );
    }
}

LiveInfo.propTypes = {

};

export default LiveInfo;