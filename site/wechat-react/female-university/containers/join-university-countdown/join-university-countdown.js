import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import BottomBar from './components/bottom-bar';
import { getVal, locationTo } from 'components/util';
import { request } from 'common_actions/common'

@autobind
class JoinUniversityCountdown extends Component {

    state = {
        menuNode:{}
    }
    componentDidMount() {
        this.initData()

        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('join-university-countdown-page');
    }

    async initData() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/get',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_ZF_FAIL',
                page:{
                    size: 20,
                    page:1
                }
            }
        }).then(res => {
            let menuNode = getVal(res, 'data.menuNode', {});
            this.setState({menuNode})
            
		}).catch(err => {
			console.log(err);
		})
    }

    render(){
        return (
            <Page title="支付倒计时" className="flex-body join-university-countdown-page">
                <div className="flex-main-s">
                    <div className="course-info-box"> 
                        { !!this.state.menuNode.keyA && <span className="title">{this.state.menuNode.keyA}</span> }
                        { 
                            !!this.state.menuNode.keyB && 
                            <img className='course-intro-pic' 
                                onClick={()=>{this.state.menuNode.keyD&&locationTo(this.state.menuNode.keyD)}}
                                src={`${this.state.menuNode.keyB}?x-oss-process=image/resize,m_fill,limit_0,w_504,h_308`} alt=""/> 
                        }
                    </div>

                    <img className='course-note-pic' src={this.state.menuNode.keyC} alt=""/>
                </div>
 
                <div className="flex-other jion-bottom">
                    <BottomBar/>            
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime:getVal(state,'common.sysTime'),
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(JoinUniversityCountdown);