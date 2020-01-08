const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';

import {Link} from 'react-router';
import { connect } from 'react-redux';

import {getDistributionUser} from '../../actions/channel-distribution';


class channelDistributionNomoreRepresent extends Component {
    state = {
        userInfo:{
            headImgUrl:"",
            name:""
        }
    }
    async userInfoInit(){
        let result = await this.props.getDistributionUser(this.props.params.userId);
        this.setState({
            userInfo:result.data.user
        })
    }
    componentDidMount(){
       this.userInfoInit();
    }
    render() {
        return (
            <Page title='推广专属页' className='channel-ditri-nomore-repre'>
                <h2 className='title-info'>本次链接的推广资格已经分配给用户</h2>
                <div className='portrait'><img src={`${this.state.userInfo.headImgUrl?this.state.userInfo.headImgUrl:'//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_64,h_64,m_fill,limit_0`}/></div>
                <p className='user-name'>{this.state.userInfo.name}</p>
                <a href={`/live/channel/channelPage/${this.props.params.channelId}.htm`} className="btn-goto">跳转到当前系列课</a>
            </Page>
        );
        
    }
}

function mapStateToProps(state) {
    return {
        userInfo:state.common&&state.common.userInfo&&state.common.userInfo.user||[],
    };
}

const mapActionToProps = {
    getDistributionUser,
};

module.exports = connect(mapStateToProps, mapActionToProps)(channelDistributionNomoreRepresent);