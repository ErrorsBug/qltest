import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';
import {
	fillParams,
} from 'components/url-utils'

import { Confirm } from 'components/dialog';
import ChangeParentDialog from 'components/dialog/middle-dialog';
import { isQlchat } from 'components/envi';
import Page from 'components/page';

import { isHideReferrer } from '../../actions/account';
import { getMyIdentity } from '../../actions/mine';
import { bindOfficialKey } from '../../actions/common';

class Intro extends Component {
	
	state={
		showFocusTop:false,
        chooseBoxShow:false,
        chooseIndex:0,
		parentId: '',
		parentName: '',
		parentAvatar: '',
		showParent: false,
		showChangeParentDialog: false
    };
    componentDidMount(){
        this.initRelationship();
    }

    async initRelationship(){
	    if(!this.props.myIdentity.identity&&this.props.location.query.officialKey){
		    const res = await this.props.bindOfficialKey({
                officialKey: this.props.location.query.officialKey || ''
            });
		    if(res.state.code === 0 && res.data.parentId && await this.isHideReferrer(res.data.parentId)){
                this.setState({//显示已绑定的人
	                parentId: res.data.parentId,
	                parentName: res.data.parentName,
	                parentAvatar: res.data.parentHeadImgUrl,
	                showParent: true
                })
            }
        }
    }


	closeFocusGuide(){
		this.setState({
			showFocusTop:false,
		});
	}
    onCloseChooseBox(){
        this.setState({
			chooseBoxShow:false,
		});
    }
    onShowChooseBox(){
        if(isQlchat()){
            window.toast('请到微信“千聊Live”公众号中购买');
            return false;
        }
        this.setState({
			chooseBoxShow:true,
		});
    }
    chooseSubsidiary(index){
        this.setState({
			chooseIndex:index,
		});
    }


	async updateCacheParent(){
	    const res = await this.props.updateCacheParent({
		    oldParentId: this.state.parentId,
            newParentId: this.state.sourceId
        });
	    if(res.state.code === 0){
	        return true;
        }else{
	        window.toast(res.state.msg);
	        return false;
        }
    }

    async isHideReferrer(parentId){
		const res = await this.props.isHideReferrer(parentId);
		return res.state.code === 0 && res.data.isHide === 'N';
    }

    render() {
        return (
            <Page title="千聊学士大礼包" className='coral-intro'>
                {
                    this.props.myIdentity.identity && <div className="tip-top">你已成为官方课代表</div>
                }
                {
                    this.state.showParent &&
                    <div className="tip-top">
                        <div className="avatar">
                            <img src={this.state.parentAvatar} alt=""/>
                        </div>
                        来自好友 <var>{this.state.parentName}</var> 的推荐
                    </div>
                }
                <div className="intro-box">
                    <div className="head">
                        <img src={this.props.giftBagData.backgroundUrl||"https://img.qlchat.com/qlLive/rocal/gift-detail-headpic.jpg"}/>
                    </div>
                    <div className="content">
                        <div className="name">{this.props.giftBagData.name}</div>
                        <div className="price">￥{formatMoney(this.props.giftBagData.money||0,100)}
                            <span>售价：<var>￥{formatMoney(this.props.giftBagData.originalMoney||0,100)}</var></span>
                        </div>
                    </div>
                    <div className="intro">
                        <span>简介</span>
                        <div>
                            {
                                this.props.giftBagData.descList&&
                                this.props.giftBagData.descList.map((item,index)=>{
                                    return <img key={`intro-pic-${index}`} src={item} />
                                })
                            }
                        </div>
                    </div>
                </div>
                
                    <div className={this.state.chooseBoxShow?"choose-subsidiary active":"choose-subsidiary"}>
                        <div className="bg" onClick={this.onCloseChooseBox.bind(this)}></div>
                        <div className="box">
                            <ul className="content">
                                <li className="top">
                                    <div className="pic"><img src={this.props.giftBagData.backgroundUrl||"https://img.qlchat.com/qlLive/rocal/gift-detail-headpic.jpg"} alt=""/></div>
                                    <div className="info">
                                        <span className="icon_delete" onClick={this.onCloseChooseBox.bind(this)}></span>
                                        <div className="price">￥{formatMoney(this.props.giftBagData.money,100)}</div>
                                        <div className="title">{this.props.giftBagData.name}</div>
                                    </div>
                                </li>
                                {
                                    this.props.giftBagData&&
                                    <li className="choosen">
                                        <span className="title">请选择类型</span>
                                        <div className="subsidiary-box">
                                            {
                                                this.props.giftBagData.businessList&&this.props.giftBagData.businessList.map((item,index)=>{
                                                    return <div className={this.state.chooseIndex==index?"subsidiary active":"subsidiary"} 
                                                        key={`zeng-list-${index}`}
                                                        onClick={()=>this.chooseSubsidiary(index)}
                                                        >
                                                        <span>{item.businessName}{item.giftName ? ' + ' + item.giftName : ''}</span>
                                                    </div>
                                                })
                                            }
                                        </div>                            
                                    </li>
                                }
                                
                            </ul>
                            <div className="btn-buy-confirm" onClick={()=>locationTo(`/wechat/page/coralOrderConfirm?index=${this.state.chooseIndex}&qr=${encodeURIComponent(this.props.giftBagData.payQrUrl)}`)}>确认购买</div>
                        </div>
                            
                        
                    </div>      
                <div className="buy-box">
                    <span className="btn-kefu" onClick={()=>locationTo("http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000000191547676")}></span>
                    {
                        this.props.myIdentity.identity?
                        <div className="btn-into" onClick={()=>locationTo("/wechat/page/coral/shop")} >开始赚钱</div>
                        :
                        <div className="btn-buy" onClick={this.onShowChooseBox.bind(this)}>立即购买</div>
                    }
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        myIdentity: state.mine.myIdentity||{},
        giftBagData: state.gift.giftBagData,
    }
}

const mapActionToProps = {
    getMyIdentity,
    bindOfficialKey,
	isHideReferrer
};

module.exports = connect(mapStateToProps, mapActionToProps)(Intro);
