import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';  
import { request } from 'common_actions/common'
import { getVal, locationTo } from '../../../components/util';
import { share } from 'components/wx-utils';
import {  fillParams ,getUrlParams} from 'components/url-utils';
import Barrage from './components/barrage';
import { createPortal } from 'react-dom';
import { BottomDialog } from 'components/dialog';  
import PayInfo from '../../components/pay-info'
import { getActStatus,getWithChildren } from '../../actions/home'
import PortalCom from '../../components/portal-com';
import Picture from 'ql-react-picture'

@autobind
class UnExperienceCamp extends Component { 
    state = { 
        dataList: [],
        menuNode:{},
        isShowPay:false,
        status:'N',
        isShow: true
    }
    
    get isDialog(){ 
        return getUrlParams('isDialog', '')
    }
    get nodeCode(){ 
        return getUrlParams('nodeCode', '')
    }
    async componentDidMount() {
        this.initData()
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-experience-camp-box');
    } 
        
    // 获取导购图列表
    async initData() {  
        const res = await getWithChildren({
            nodeCode: this.nodeCode,
            page:{
                size: 9999,
                page:1
            }
        }) 
        if(res?.menuNode?.keyF=='pay'){
            const statusRes=await getActStatus({actId:res?.menuNode?.id})
            this.setState({
                status:statusRes.status
            })
        }
        this.setState({ 
            menuNode:res?.menuNode
        },()=>{
            this.initShare()
        })  
    }
    
    initShare() {
        const { menuNode } = this.state 
        let title = menuNode?.keyA
        let desc =  menuNode?.keyB
        let imgUrl = menuNode?.keyC  
        let shareUrl = fillParams({},location.href,[]) 
        if(title&&desc&&imgUrl){ 
            share({
                title: title,
                timelineTitle: title,
                desc: desc,
                timelineDesc: desc,
                imgUrl: imgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
                shareUrl: shareUrl
            });
        }
        
    }
    toggle(){
        this.setState({
            isShowPay:!this.state.isShowPay
        })
    }

    hideDialog() {
        this.setState({ isShow: false })
    }
    
    render(){
        const {menuNode={}, isShowPay, status, isShow } = this.state 
        const { title,children,keyD,keyE,keyF,keyG,keyH,keyK,keyL,id, keyI, keyJ } = menuNode  
        return (
            <Page title={ title||'' } className="un-experience-camp-box">
                <div className="uec-main"> 
                    <div className="uec-list">
                        {
                            children?.map((item,index)=>{
                                return(
                                    !!item?.keyA&&<div className="uec-item on-log on-visible" 
                                        data-log-name='引流图片'
                                        data-log-region="un-experience-camp-img"
                                        data-log-pos={index+1}
                                         key={index+1} onClick={()=>{item?.keyB&&locationTo(item?.keyB)}}>
                                        <img src={item?.keyA} /> 
                                    </div> 
                                )
                            })
                        }
                    </div>
                </div> 
                {
                    this.isDialog=='Y'&&
                    createPortal(
                        <Barrage  
                            doingSt={['正在学', '已开始学习','5秒前下单','邀你一起学','刚刚下单','下单成功']}
                        />
                        ,document.getElementById('app'))
                }  
                
                {
                    createPortal(
                        <div className="uec-bottom-img-container">
                            {
                                keyK&&<div className="uec-float-icon" onClick={()=>{keyL&&locationTo(keyL)}} > <Picture resize={{w:170,h:170}} src={ keyK } /></div>
                            }
                            {
                                keyD&& 
                                <div className="uec-bottom-img on-log on-visible" 
                                    data-log-name="底部悬浮图片"
                                    data-log-region={"un-bottom-img"}
                                    data-log-pos="0">
                                    {
                                        /**keyF支付模式，status='N'未购买,keyG和keyH是数字 */
                                        keyF=='pay'&&status=='N'&& !isNaN(parseFloat(keyG)) &&keyG>=0 &&(!keyH||!isNaN(parseFloat(keyH)))?
                                        <img src={ keyD } onClick={this.toggle} />
                                        :
                                        <img src={ keyI || keyD } onClick={()=>{keyE&&locationTo(keyE)}} />
                                    }
                                </div>
                            }
                        </div>
                        ,document.getElementById('app'))
                }  
                {
                    createPortal(       
                        <BottomDialog
                            show={isShowPay}
                            theme='empty'  
                            className={`university-dialog-payment`}
                            onClose={this.toggle}>
                            <PayInfo price={keyG} discountPrice={keyH} jumpUrl={keyE} actId={id} payUrl={'/api/wechat/transfer/baseApi/h5/pay/ufwActOrder'}/>
                        </BottomDialog>
                        , document.getElementById('app')
                    )
                }
                { isShow && !!keyJ && (keyF=='pay' && status =='Y') &&
                    <PortalCom className="university-url">
                        <div onClick={ this.hideDialog }>
                            <div onClick={ (e) => { 
                                e.stopPropagation();
                                e.preventDefault();
                                keyE&&locationTo(keyE) }
                             }><img src={ keyJ } /></div>
                        </div>
                    </PortalCom>
                }
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = { 
 
};

module.exports = connect(mapStateToProps, mapActionToProps)(UnExperienceCamp);