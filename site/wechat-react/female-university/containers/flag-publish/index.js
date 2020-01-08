import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ImgUpload from '../../components/img-upload'
// import { uploadImage } from "../../../actions/common";
import { getVal, locationTo, formatDate } from 'components/util';
import { request } from 'common_actions/common';
import { isQlchat, isPc, isWeixin, isAndroid } from 'components/envi'
import PortalCom from '../../components/portal-com';

@autobind
class FlagPublish extends Component {
    state = {
        picList: [],
        textValue: '',
        imgMaxCount: 9,
        isStatic: false,
        clientHeight: false,
    }
    componentDidMount() {
         // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('publish-box');
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        this.setState({ clientHeight })
        window.addEventListener('resize', this.resize)
    }
    closeForm() {
        this.setState({
            isShowEdit: false
        })
    }
    // 显示编辑
    handleShowEdit() {
        this.setState({
            isShowEdit: true
        })
    }

    changeTextArea(e){
        let str = e.target.value;
        if(str.length > 1000){
            str = str.substring(0,1000);
        }
        this.setState({
            textValue: str,
        },()=>{
            this.textAreaInput.style.height = 'auto';
            this.textAreaInput.style.height =  this.textAreaInput.scrollHeight + 'px';
        });
    }


    uploadHandle(imgItems) {
        if (!imgItems) {
            return false;
        }
        let imgLinks = imgItems.map((item,idx) => {
            return {
                id:Date.now()+idx,
                ...item,
                content: item.type == 'image' ? item.url :item.serverId,
            }
        })
        this.setState({
            picList: [...this.state.picList ,...imgLinks],
        });
        setTimeout(()=>{
             // 手动触发打点日志 
            typeof _qla != 'undefined' && _qla('click', {
                region:'un-flag-publish-upload',
            });
        })
    }

    async onConfirm(){ 
        if(!this.state.textValue){
            window.toast('请输入今日心得哦');
            return false;
        } 
        window.loading(true)
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/universityflag/flagCardAdd',
            method: 'POST',
            body: {
                desc: this.state.textValue,
                image: this.state.picList,
                date:formatDate(new Date())
            }
        }).then(res => {
            if(getVal(res, 'state.code','' ) === 0){
                window.toast('发布成功！');
                locationTo(`/wechat/page/flag-home?cardDate=${new Date().getTime()}`);
                window.loading(false)
            }else{
                window.loading(false)
                window.toast(getVal(res, 'state.msg','' ));
                
            }
            
		}).catch(err => {
			console.log(err);
		})
    }

    deletePic(index){
        let picList = this.state.picList;
        picList.splice(index,1);
        this.setState({
            picList
        });
    }
    onClickViewPic(src){
        const arr = this.state.picList.map((item) => {
            return item.localId ? item.localId: item.content
        })
        window.showImageViewer(src,arr);
    }
    
    handleInput(flag){
        if(isAndroid() && ((!isPc() && isWeixin()) || isQlchat())) {
            if(!flag) {
                setTimeout(() => {
                    this.setState({
                        isStatic: flag
                    })
                },200)
            } else {
                this.setState({
                    isStatic: flag
                })
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize) // 移除监听
    }
    resize = () => {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (this.state.clientHeight > clientHeight) { // 键盘弹出
            this.handleInput(true)
        } else { // 键盘收起
            this.handleInput(false)
        }
    }
    render(){
        return (
            <Page title="发布打卡" className="publish-box">
                <div className="publish-warp">
                    <div className="title">写下今日心得 
                        { !isQlchat() && history.length>0 && <i className="btn-close-back on-log on-visible" 
                            data-log-name='关闭按钮'
                            data-log-region="un-flag-publish-close"
                            data-log-pos="0"
                            onClick={()=>{history.go(-1)}}></i>}
                    </div>
                    <div className="tips">记录每日学习心得，见证自己的成长</div>
                    <div className="text-box">
                        <textarea 
                            ref={el=>this.textAreaInput = el} 
                            value={this.state.textValue} 
                            onBlur={ () => this.handleInput(false) }
                            onFocus={ () => this.handleInput(true) }
                            onChange={this.changeTextArea}  
                            placeholder="在这记录你的学习心得吧~" ></textarea>
                        <div className={`text-num  ${this.state.textValue.length>=1000? 'red':''}`}>{this.state.textValue.length}/1000</div>
                    </div>
                    <div className="tips">上传学习笔记，支持手写版和电子版</div>
                    
                    <div className="pic-box">
                    { this.state.picList.map((item,index)=>{
                        return <div>
                            <img onClick={ () => this.onClickViewPic(item.localId ? item.localId: item.content) } src={item.localId ? item.localId: item.content} />
                            <div className="btn-close" onClick={()=>this.deletePic(index)}></div>
                        </div>
                    })}
                    { this.state.picList.length<9 && 
                    <ImgUpload
                            multiple={ 'true' } 
                            count = {this.state.imgMaxCount - (this.state.picList.filter(item => {
                                return item.type=='image' ||item.type=='imageId' ;
                            }).length)}
                            maxCount = {this.state.imgMaxCount}
                            uploadHandle = {this.uploadHandle}
                    >
                        <div className="btn-add-pic icon_plus"></div>
                    </ImgUpload>
                    } 
                    </div>
                </div>

                
                <PortalCom className={ `confirm-bottom ${ this.state.isStatic ? 'static' : '' }` }>
                    <div className="btn-confirm on-log on-visible" 
                        data-log-name='确定发布'
                        data-log-region="un-flag-publish-confirm"
                        data-log-pos="0"
                        onClick={this.onConfirm}>确定</div>
                </PortalCom>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagPublish);