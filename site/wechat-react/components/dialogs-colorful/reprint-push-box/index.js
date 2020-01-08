import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import Clipboard from 'clipboard';

import Redpoint from '../../redpoint';
import { pushDistributionCardMaking } from './draw-push-card';

import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';

import { api } from '../../../actions/common';


//专业版转载的推广弹框
class ReprintPushBox extends Component {
    state = {
        qrcodeUrl: '',
        pushBoxData:this.props.datas||{},
        mainVersible:true,
        haibaoVersible:false,
        haibaopic:'',
        clipboardEnable:true,
    }

    // 获取需要展示的二维码的图片URL
    getQr(props) {
        api({
            url: '/api/wechat/get-qrcode',
            method: 'GET',
            showLoading: false,
            body: {
                channel: 'knowledgeQr',
                channelId: props.datas.businessId,
            }
        }).then(result => {
            if (result.state.code === 0) {
                this.setState({
                    qrcodeUrl: result.data.qrUrl
                });
                // 绘制推广海报
                pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg", props.datas, this.setImgFunc.bind(this), true, "W", 653, 653, result.data.qrUrl);
            } else {
                console.error(result.state.msg);     
            }
        }).catch(result => {
            console.error(result.state.msg);
        });
    }

    componentDidMount() {
        // this.getQr(this.props);
        pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg",this.props.datas,this.setImgFunc.bind(this), true, "W", 653, 653, this.props.shareUrl);
        //复制链接
        var clipboard = new Clipboard(".fuzhi");
        if(!Clipboard.isSupported()){
            this.setState({
                clipboardEnable:false,
            });
        }else{
            clipboard.on('success', function(e) {
                window.toast('复制成功！');            
            });  
            clipboard.on('error', function(e) {
                window.toast('复制失败！请手动复制');
            }); 
        }
    }

    componentWillUpdate(nextProps){
        if(nextProps.datas!=this.props.datas){
            // this.getQr(nextProps);
            pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg",nextProps.datas,this.setImgFunc.bind(this), true, "W", 653, 653, this.props.shareUrl);
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
        this.setState({
            haibaoVersible:true,
        });
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
    selectShareUrl(e){
        e.target.select();
    }

    copyTips(){
        if(!this.state.clipboardEnable){
            window.toast("复制失败，请手动长按复制");
        }
    }

    
    render() {
        return (
            <div className="reprint-push-box">
                {this.state.mainVersible&&<div className="bg" onClick={this.onPushBoxClose.bind(this)}></div>}
                {
                    this.state.mainVersible&&
                    <div className="main">
                        <div className="top">
                            <span className="title">推广转载课</span>
                            <span className="icon_delete" onClick={this.onPushBoxClose.bind(this)}></span>
                        </div>
                        {/* <div className="info">  
                            <div className="left"><img src={imgUrlFormat(this.props.datas.businessImage,"@296h_480w_1e_1c_2o")} alt=""/></div>
                            <div className="right">
                                <span className="name elli-text">{this.props.datas.businessName}</span>
                                <span className="price">原价: ￥{this.props.datas.amount}（分成比例 {this.props.percent}%）</span>
                                <span className="income">预计收益:￥{this.props.percent*this.props.datas.amount/100}</span>
                            </div>
                        </div> */}
                        <div className="push-channel">
                            <ul>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式1：推广二维码</span>
                                        <span className="tip">学员扫右侧二维码完成购买后，你可获得收益，长按图片保存</span>
                                    </div>
                                    <div className="right">
                                        <span className="haibao-pic" >
                                            <img src={`http://qr.topscan.com/api.php?text=${this.props.shareUrl}`} alt=""/>
                                            {/* <img src={this.state.qrcodeUrl} alt="" /> */}
                                        </span>
                                    </div>
                                    
                                    
                                </li>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式2：推广链接</span>
                                        <span className="tip">分享此链接，学员完成购买后您即可获得收益</span>
                                        {
                                            this.state.clipboardEnable?
                                            <span className="content elli-text">
                                                {this.props.shareUrl}
                                            </span>
                                            :
                                            <input className="copy-input" type="text" onClick={this.selectShareUrl.bind(this)}  value={this.props.shareUrl} />
                                        }
                                        
                                    </div>
                                    <div className="right">
                                        <span className="btn-fuzhi fuzhi" 
                                            data-clipboard-text={this.props.shareUrl}
                                            onClick={this.copyTips.bind(this)}>
                                            复制链接
                                        </span>
                                    </div>
                                    
                                    
                                </li>
                                <li className="flex-box">
                                    <div className="left">
                                        <span className="title">方式3：推广海报</span>
                                        <span className="tip">
                                            点击右侧推广海报，长按转发给朋友
                                            {/* <br/>
                                            或朋友圈进行推广 */}
                                        </span>
                                    </div>
                                    <div className="right">
                                        <span className="haibao-pic" onClick={this.haibaoCheck.bind(this)}>
                                            <img src={this.state.haibaopic} alt=""/>
                                        </span>
                                    </div>
                                        
                                    
                                </li>
                                <li className="flex-box last">
                                    <div className="left">
                                        <span className="title">方式4：直接分享</span>
                                        <span className="tip">
                                            进入对应系列课介绍页，点击右上角<i className="icon_dots_horizontal"></i>，【发送给好友】
                                            {/* 或【分享到朋友圈】进行推广 */}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
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

/*
    datas   课程信息对象
        businessImage   头图
        businessId      id
        businessName    课程名称
        amount          价格

    percent  分成比例

    shareUrl   分享链接

    onClose     关闭弹框方法

*/
ReprintPushBox.propTypes = {
    onClose: PropTypes.func.isRequired,
    datas: PropTypes.object.isRequired,//价格的单位是分
    percent: PropTypes.number.isRequired,//20%，这里就传20
    shareUrl: PropTypes.string.isRequired,
};

export default ReprintPushBox;