import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import { getVal, locationTo, imgUrlFormat } from 'components/util';

import { apiService } from "components/api-service";
import { fillParams } from 'components/url-utils';

class LiveChange extends Component {
    state={
        createLiveList:[],
        manageLiveList:[],
        liveId: this.props.location.query.liveId||'',
    }

    componentDidMount(){
        this.getMgrLiveList();
    }

    /* 获取我的管理直播间 */
    async getMgrLiveList() {
        const {manager, creater } = this.props;
        this.setState({
            createLiveList: creater,
            manageLiveList: manager,
        });
    }

    gotoBackstage = (liveId) => {
        if (this.props.location.query.target) {
            locationTo(fillParams({
                liveId,
            }, this.props.location.query.target));
        } else {
            locationTo(`/wechat/page/backstage?liveId=${liveId}`)
        }
    }

    render() {
        const {manageLiveList, createLiveList, liveId } = this.state;
        return (
            <Page title="切换直播间" className="live-change-page">
            <div className="page-main">
                {createLiveList.length>0&&<div className="title">我创建的直播间</div>}
                {createLiveList.length>0&&<div className="list">
                {
                    createLiveList.map((value,index)=>{
                        return <div className={`live-info ${liveId === value.id?'active':''}`} 
                            key={index}
                            onClick={()=>{this.gotoBackstage(value.id)}}
                        >
                            <div className="pic"> <img src={imgUrlFormat(value.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_140,w_140")} /> </div>
                            <div className="name">
                                <span className="elli">{value.name}</span>
                                {liveId === value.id && <i className="choose-icon"></i>}
                            </div>
                            
                        </div>
                    })
                }
                </div>}
                {manageLiveList.length>0&&<div className="title">我管理的直播间</div>}
                {manageLiveList.length>0&&<div className="list">
                {
                    manageLiveList.map((value,index)=>{
                        return <div className={`live-info ${liveId === value.id?'active':''}`} 
                            key={index}
                            onClick={()=>{this.gotoBackstage(value.id)}}
                        >
                            <div className="pic"> <img src={imgUrlFormat(value.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_140,w_140")} /> </div>
                            <div className="name">
                                <span className="elli">{value.name}</span>
                                {liveId === value.id && <i className="choose-icon"></i>}
                            </div>
                            
                        </div>
                    })
                }
                </div>}
            </div>
            
            {
                createLiveList.length <= 0 ?
                <div className="page-bottom">
                    <div onClick={()=>{locationTo('/wechat/page/create-live?ch=create-live_admin_change')}}>创建直播间</div>
                </div>
                :null
            }
                
            </Page>
        );
    }
}

function mapStateToProps (state) {
	return {
        creater: state.liveBack.creater,
        manager: state.liveBack.manager,
	}
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveChange);