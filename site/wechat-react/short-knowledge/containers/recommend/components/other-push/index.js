import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators'
import Detect from 'components/detect';
import { uploadImage, getStsAuth } from '../../../../actions/common';
import { imgUrlFormat, locationTo } from "components/util";
import { getUrlParams } from 'components/url-utils';


import { getKnowledge } from "../../../../actions/short-knowledge";
import { request } from 'common_actions/common';

import './style.scss';

@autobind
class OtherPush extends Component {

    state = {
        titleNum: 0 ,
        titleContent: '',
        linkContent: '',
        picUrl: '',
        showTipsBox:false,
        goodsDto: {},
    }
    
    componentDidMount (){
        this.initStsInfo();
        this.getKnowledgeInfo();
    }

    // oss上传
	initStsInfo() {
		this.props.getStsAuth();
		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
	}

    changeTitle(e){
        const title = e.target.value || '';
        
        this.setState({
            titleContent: title,
            titleNum: title.length||0,
            
        });
    }
    changeLink(e){
        this.setState({
            linkContent: e.target.value || '',
        });
    }

    
    onClickSubmit = () => {
        if(this.state.titleNum>30){
            window.toast('标题字数不能超过30，请重新编辑');
            return false;
        }else if(!/(http|https):\/\/.*\.com/.test(this.state.linkContent) || /(lizhiweike|ximalaya|xima|xeknow|xiaoeknow|xiaoe)/.test(this.state.linkContent)){
            window.toast('暂不支持输入该链接');
            return false;
        }

        window.loading(true);
        request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/setKnowledgeCourse',
            body: {
                businessType: 'defined',
                knowledgeId: this.props.knowledgeId,
                goodsUrl: this.state.linkContent,
                goodsImageUrl: this.state.picUrl,
                goodsName: this.state.titleContent,
            }
        }).then(res => {
            window.toast('设置成功');
            const fallback = getUrlParams().fallback;
            if (fallback) {
                locationTo(fallback);
            } else {
                history.back();
            }
        }).catch(err => {
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    async imageHandler(e){
        const result = await this.props.uploadImage({file: e.target.files[0], needTip: true, needLoading: true})
        this.setState({
            picUrl: result,
        });  
    }
    showTipsBoxClick (){
        this.setState({ showTipsBox: true });
    }

    hideTipsBoxClick (){
        this.setState({ showTipsBox: false });
    }

    async getKnowledgeInfo(){
        let result = await this.props.getKnowledge({
            id: this.props.knowledgeId,
        });
        if(result.state && result.state.code === 0){
            const goodsDto = (result.data.dto && result.data.dto.goodsDto) || {} ;
            this.setState({
                linkContent: goodsDto.goodsUrl || '',
                picUrl : goodsDto.goodsImageUrl || '',
                titleContent : goodsDto.goodsName || '',
            });
            
        }
        
    }
    
    render() {
        const { linkContent , titleContent, picUrl, titleNum, showTipsBox } = this.state;
        const canSubmit = titleContent !=='' && picUrl && linkContent!='';
        let portalBody =  document.querySelector(".p-sk-recom");
        return (
            <div className="other-push">
                <div className="main-box">
                    <div className="header">请自定义推广内容，会展示在视频页 <span className="btn-example" onClick={this.showTipsBoxClick}>示例</span></div>
                    <div className="info-part">     
                        <div className="title">设置标题 <i>{titleNum}/30</i></div>
                        <input value={ titleContent } placeholder="请输入标题，吸引用户点击链接~" onChange= {this.changeTitle} />
                    </div>
                    <div className="info-part"> 
                        <div className="title">设置链接 </div>
                        <input value={ linkContent } placeholder="请输入链接" onChange = {this.changeLink} />
                    </div>
                    <div className="info-part btn-pic-select"> 
                        <div className="title">设置配图 <div className="tips">注意：配图尺寸8:5</div></div>
                        <div className="pic"><img src={picUrl && imgUrlFormat(picUrl,'?x-oss-process=image/resize,m_fill,limit_0,h_125,w_200')} /></div>
                        <input id="upload-image" type="file" accept="image/*"  onChange = {this.imageHandler} />
                    </div>
                </div>
                
                <div className="footer">
                    <button className={`btn-submit ${canSubmit? '':'disabled'}`}
                        onClick={()=>{canSubmit && this.onClickSubmit() }}
                    >确认</button>
                </div>
                {
                    showTipsBox &&
                    createPortal(<div className="tips-box" onClick={this.hideTipsBoxClick}> 
                        <div className="wrap">
                            <div><img src="https://img.qlchat.com/qlLive/short/example.png" /></div>
                            <div>*在播放结束时弹出</div>
                        </div>
                    </div>,
                    portalBody)
                }
                
            </div>
        );
    }
}

OtherPush.propTypes = {

};

export default connect(state => ({

}), {
    uploadImage,
    getStsAuth,
    getKnowledge,
})(OtherPush);
