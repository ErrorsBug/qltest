const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { getDistributionUser } from '../../../actions/channel-distribution';

class DistributionRepresentNomore extends Component {
    state = {
        userInfo:{
            headImgUrl: "",
            name: ""
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
        const {
            location: {
                query: {
                    type,
                    id 
                }
            }
        } = this.props;

        let businessName = '';
        let redirectUrl = '';

        switch (type) {
            case 'channel':
                businessName = '系列课';
                redirectUrl = 'live/channel/channelPage/'+ id +'.htm';
                break;
            case 'topic':
                businessName = '话题';
                redirectUrl = 'topic/'+ id + '.htm';
                break;
            default:
                businessName = '直播间';
                redirectUrl = 'live/'+ id + '.htm';
                break;
        }

        return (
            <Page title='推广专属页' className='distribution-nomore-repre'>
                <h2 className='title-info'>本次链接的推广资格已经分配给用户</h2>
                <div className='portrait'><img src={`${this.state.userInfo.headImgUrl?this.state.userInfo.headImgUrl:'//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_64,h_64,m_fill,limit_0`}/></div>
                <p className='user-name'>{this.state.userInfo.name}</p>
                <a href={`/wechat/page/${redirectUrl}`} className="btn-goto">跳转到当前{businessName}</a>
            </Page>
        );
        
    }
}

function mapStateToProps(state) {
    return {
        userInfo:state.common && state.common.userInfo&&state.common.userInfo.user || [],
    };
}

const mapActionToProps = {
    getDistributionUser,
};

module.exports = connect(mapStateToProps, mapActionToProps)(DistributionRepresentNomore);