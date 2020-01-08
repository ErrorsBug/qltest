import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import Clipboard from 'clipboard';

import Redpoint from '../../redpoint';
import { pushDistributionCardMaking } from './draw-push-card';

// import { locationTo } from '../../util';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';


//珊瑚计划的推广弹框
class CoralPushBox extends Component {
    state = {
        pushBoxData:this.props.datas||{},
        mainVersible:true,
        haibaoVersible:false,
        haibaopic:'',
        thisShareUrl:'',
    }
    componentDidMount() {
        pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg",this.props.datas,this.setImgFunc.bind(this), true, "W", 653, 653, this.props.officialKey,this.props.shareKey);
        //复制链接
        var clipboard = new Clipboard(".fuzhi");   
        clipboard.on('success', function(e) {
            window.toast('复制成功！');            
        });  
        clipboard.on('error', function(e) {
            window.toast('复制失败！请手动复制');
        }); 
    }

    componentWillUpdate(nextProps){
        if(nextProps.datas!=this.props.datas){
            pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg",nextProps.datas,this.setImgFunc.bind(this), true, "W", 653, 653, this.props.officialKey,this.props.shareKey);
            
            this.setState({
                thisShareUrl:this.props.datas.url?
                (/(officialKey|lshareKey)/.test(this.props.datas.url)?this.props.datas.url:`${this.props.datas.url}?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}`)
                :
                (this.props.datas.businessType==="CHANNEL"?
                `${window.location.origin}/live/channel/channelPage/${this.props.datas.businessId}.htm?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}`
                :
                `${window.location.origin}/topic/details?topicId=${this.props.datas.businessId}&officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}&pro_cl=coral`
                )
            })  
        }
    }
    setImgFunc(url){
        this.setState({
            haibaopic:url,
            mainVersible:true,
            haibaoVersible:false,
        });
    }
    haibaoCheck(){
        // this.setState({
        //     haibaoVersible:true,
        // });
	    window.showImageViewer(this.state.haibaopic, [this.state.haibaopic]);
    }
    onPushBoxClose(){
        this.setState({
            haibaoVersible:false,
        });
        this.props.onClose();
    }
    onPushBoxPicClose(){
        this.setState({
            haibaoVersible:false,
        });
    }


    
    render() {
        return (
            <div className={`coral-push-box${this.props.displayType === 'inset' ? ' inset' : ''}`}>
                {this.state.mainVersible&&<div className="bg" onClick={this.onPushBoxClose.bind(this)}></div>}
                {
                    this.state.mainVersible&&
                    <div className="main">
                        {
                            this.props.displayType !== 'inset' &&
                            <div className="top">
	                            {/*<span className="title"><i className="icon_checked"></i>已加入推广列表</span>*/}
                                <span className="icon_delete" onClick={this.onPushBoxClose.bind(this)}></span>
                            </div>
                        }
                        <div className="info">
                            <div className="left"><img src={imgUrlFormat(this.props.datas.businessImage,"@296h_480w_1e_1c_2o")} alt=""/></div>
                            <div className="right">
                                <span className="name elli-text">{this.props.datas.businessName}</span>
                                <span className="price">售价：￥{formatMoney(this.props.datas.amount || this.props.datas.money)}</span>
                                <span className="income">预计收益：￥{formatMoney(Number(this.props.datas.percent*(this.props.datas.amount || this.props.datas.money)/100),100)}</span>
                            </div>
                        </div>
                        <div className="push-channel">
                            <ul>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式1：专属分享链接</span>
                                        <span className="tip">分享此链接完成购买即可获得收益</span>
                                        <span className="content elli-text">
                                            {
                                                this.props.datas.url?
                                                (/(officialKey|lshareKey)/.test(this.props.datas.url)?this.props.datas.url:`${this.props.datas.url}?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}`)
                                                :
                                                (
                                                    this.props.datas.businessType==="CHANNEL"?
                                                    `${window.location.origin}/live/channel/channelPage/${this.props.datas.businessId}.htm?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}&pro_cl=coral`
                                                    :
                                                    `${window.location.origin}/topic/details?topicId=${this.props.datas.businessId}&officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}&pro_cl=coral`                                                
                                                )
                                            }
                                        </span>
                                    </div>
                                    <div className="right">
                                        <span 
                                            className="btn-fuzhi fuzhi on-log"
                                            data-log-name="复制链接"
                                            data-log-region="course-bottom"
                                            data-log-pos="copylink"  
                                            data-clipboard-text={
                                                this.props.datas.url?
                                                (/(officialKey|lshareKey)/.test(this.props.datas.url)?this.props.datas.url:`${this.props.datas.url}?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}`)
                                                :
                                                (
                                                    this.props.datas.businessType==="CHANNEL"?
                                                    `${window.location.origin}/live/channel/channelPage/${this.props.datas.businessId}.htm?officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}&pro_cl=coral`
                                                    :
                                                    `${window.location.origin}/topic/details?topicId=${this.props.datas.businessId}&officialKey=${this.props.officialKey}${this.props.shareKey?'&lshareKey='+this.props.shareKey:''}&pro_cl=coral`
                                                )}>
                                            复制链接
                                        </span>
                                    </div>
                                    
                                    
                                </li>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式2：专属推广海报</span>
                                        <span className="tip">
                                            点击右侧推广海报，长按转发给朋友
                                            {/* <br/>
                                            或朋友圈进行推广 */}
                                        </span>
                                    </div>
                                    <div className="right">
                                        <span   
                                            className="haibao-pic on-log" 
                                            onClick={this.haibaoCheck.bind(this)}
                                            data-log-name="生成课程海报"
                                            data-log-region="course-extension"
                                            data-log-pos="create-poster" 
                                        >
                                            <img src={this.state.haibaopic} alt=""/>
                                        </span>
                                    </div>
                                        
                                    
                                </li>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式3：直接分享</span>
                                        <span className="tip">
                                            点击右上角<i className="icon_dots_horizontal"></i>，通过【发送给好友】
                                            <br/>
                                            或【分享到朋友圈】进行推广
                                        </span>
                                    </div>
                                        
                                </li>
                            </ul>
                        </div>
                        {
                            this.props.displayType === 'inset' ?
                                <div className="operation">
                                    <div className="close-btn" onClick={this.props.onClose}>关闭</div>
                                    <div className="look-btn" onClick={()=>locationTo('/wechat/page/coral/shop/push-list')}>查看推广列表</div>
                                </div>
                                :
                                <div className="btn-look" onClick={()=>locationTo('/wechat/page/coral/shop/push-list')}>查看推广列表</div>

                        }
                    </div>
                }
                {this.state.haibaoVersible&&<div className="bg haibao-bg" onClick={this.onPushBoxPicClose.bind(this)}></div>    }
                {
                    this.state.haibaoVersible&&
                    <div className="haibao-main">
                        <img src={this.state.haibaopic} alt=""/>
                    </div>
                }
                    
            </div>
        );
    }
}

CoralPushBox.propTypes = {
    shareKey: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    datas: PropTypes.object.isRequired,//价格的单位是分
    officialKey: PropTypes.string.isRequired,
	displayType: PropTypes.string
};

export default CoralPushBox;