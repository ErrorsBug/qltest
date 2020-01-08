import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    locationTo,
} from 'components/util';


// actions
import { getMyIdentity } from '../../actions/mine';
import { getUserInfo } from '../../actions/common';


import Page from 'components/page';

class CoralIndex extends Component {

	
	state={
	}

	componentDidMount(){
		this.props.getMyIdentity();
		this.props.getUserInfo();
	}

    render() {
        return (
            <Page title="珊瑚计划" className='coral-index'>
				{
					this.props.myIdentity&&this.props.myIdentity.identity?
					<div className="joined-box">
						<div className="top-pic"></div>
						<div className="joined">
							<div className="title"></div>
							<div className="content">
								<span onClick={()=>locationTo("/wechat/page/coral/order/details")}>查看礼包订单信息<i className="icon_enter"></i></span>
								<div className="btn-zhuan" onClick={()=>locationTo("/wechat/page/coral/shop")} >马上赚钱</div>
								<div className="btn-income" onClick={()=>locationTo("/wechat/page/coral/profit")} >我的收益</div>
								<div className="btn-yao" onClick={()=>locationTo("/wechat/page/coral/share?officialKey="+this.props.userInfo.userId)} >邀请好友加入</div>
							</div>
						</div>
					</div>
					:
					<div className="not-joined-box">
						<div className="coral-index-top"></div>
						<div className="coral-index-buttons">
							<span className="title">六大权益</span>
							<dl>
								<dd className="push-list">
									<div>海量课程</div>
								</dd>
								<dd className="push-order"
								>
									<div>全线折扣</div>
								</dd>
								<dd className="mine-income" >
									<div>推荐奖励</div>
								</dd>
							</dl>
							<dl>
								<dd className="grounp-manage" >
									<div>社群绑定</div>
								</dd>
								<dd className="performance-manage">
									<div>听课省钱</div>
								</dd>
								<dd className="coral-course">
									<div>分享赚钱</div>
								</dd>
							</dl>

							<div className="join-coral-box">
								<span className="tip">认可知识付费购买专属课程即可成为官方课代表</span>
								<span className="btn-join" 
									onClick={()=>{
										this.props.location.query.officialKey?
										locationTo("/wechat/page/coral/intro?officialKey="+this.props.location.query.officialKey)
										:
										locationTo("/wechat/page/coral/intro")
									}}
								>立即加入</span>
							</div>
						</div>
						
					</div>
				}
					
				
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
		myIdentity: state.mine.myIdentity||{},
		userInfo: state.common.userInfo,
    }
}

const mapActionToProps = {
	getMyIdentity,
	getUserInfo,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CoralIndex);
