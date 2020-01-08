const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FileInput from 'components/file-input';
import Page from 'components/page';
import { locationTo ,updatePageData} from 'components/util';
import { share } from 'components/wx-utils';
import IntroList from './components/intro-list';
import { Confirm } from 'components/dialog'

// actions
import {
    getChannelIntro,
    saveChannelIntro,
} from '../../actions/channel-intro-edit';

import { uploadImage,getStsAuth } from '../../actions/common';

class ChannelIntroEdit extends Component {
    constructor(props){
        super(props)
    }


    state = {
        channelIntroList:[]
    }

    // 初次加载页面数据
    async loadChannelIntro(category,channelId){
        let result = await this.props.getChannelIntro(category,channelId);
        this.setState({
            channelIntroList:result
        })
    }

    componentDidMount() {
        if(this.props.params.channelId){
            this.loadChannelIntro(this.props.location.query.type,this.props.params.channelId);
        }
        this.initStsInfo();
    }

    // oss上传
    initStsInfo() {
        this.props.getStsAuth();

        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

     componentWillReceiveProps(nextProps) {
    }


    // 排序对调
    changeSort(_list,key_one,key_two){
        let list = _list;
        let introItem = list[key_one];

        list[key_one] = list[key_two];
        list[key_two] = introItem;

        list[key_one].sortNum = key_one + 1;
        list[key_two].sortNum = key_two + 1;

        return list;
    };




    // 上调排序
    introItemSortUp(index){
        if(index >0 ){
            const introList =  this.changeSort(this.state.channelIntroList,Number(index),Number(index) - 1);
            this.setState({
                channelIntroList:[...introList]
            })
        }
    }

    // 下移排序
    introItemSortDown(index){
        let itemLength = this.state.channelIntroList.length;

        if(index < itemLength - 1 ) {
            const introList =  this.changeSort(this.state.channelIntroList,Number(index),Number(index) + 1);
            this.setState({
                channelIntroList:[...introList]
            })
        }
    }

    // 删除
    introItemDel(id){
        let introList = this.state.channelIntroList;
        introList.splice(id,1);

        this.setState({
            channelIntroList:[...introList]
        })
    }

    // 修改文本
    introItemChange(id,key,val){
        let list = this.state.channelIntroList;
        let introList = list.map((item,index) =>{
            if (index== id) {
                return {...item, [key]: val};
            }else{
                return item;
            }
        })
        this.setState({
            channelIntroList:[...introList]
        })
    }

    // 保存编辑
    async saveCahnnelIntro(tag){
        if(tag=="confirm"){
            let wordLengthOk = true;
            this.state.channelIntroList.map((item) => {
                if (item.type === 'text' && item.content && item.content.trim().length > 1000) {
                    wordLengthOk = false;
                    return false;
                }
            });

            if (!wordLengthOk) {
                window.toast('简介文本长度不能超过1000个字');
                this.refs.dialogComfirm.hide();
                return;
            }

            let result = await this.props.saveChannelIntro(this.props.location.query.type,this.props.params.channelId,this.state.channelIntroList);
            if (result.state.code == "0"){

                updatePageData()//更新页面数据
                await window.toast("保存成功",2000);
                // this.props.router.push('/wechat/page/channel-intro-list/'+this.props.params.channelId);
                this.props.router.go(-1);
            } else {
                result.state && window.toast(result.state.msg);
            }
            this.refs.dialogComfirm.hide();
        }
    }

    judgeAddLength(type) {
        let introList = this.state.channelIntroList;

        // 判断图片或者文字块是否超出20个
        let imageNum = 0;
        let textNum = 0;
        introList.map((item) => {
            if (item.type === 'text') {
                textNum++;
            } else if (item.type === 'image') {
                imageNum++;
            }
        });

        if (imageNum >= 20 && type === 'image') {
            // window.toast('图片数量不能超过20个');
            return;
        } else if (textNum >= 20 && type === 'text') {
            // window.toast('文本域数量不能超过20个');
            return;
        }

        return true;
    }

    // 添加文字块
    addIntroItem(type,addContent){
        let item = {
            content:"",
            id:"",
            tempId: Date.now(),
        };
        let introList = this.state.channelIntroList;

        if (!this.judgeAddLength(type)) {
            switch(type) {
                case 'image':
                    window.toast('图片数量不能超过20个');
                    break;
                case 'text':
                    window.toast('文本域数量不能超过20个');
                    break;
            }
            return;
        }

        switch(type){
            case "image" : item.type = "image"; break;
            case "text" : item.type = "text"; break;
        }
        if(addContent){
            item.content = addContent;
        }

        this.setState({
            channelIntroList:[...introList,item]
        })
    }

    canImageUpload() {
        if (!this.judgeAddLength('image')) {
            return false;
        }

        return true;
    }

    handleAddImageClick(e) {
        if (!this.judgeAddLength('image')) {
            window.toast('图片数量不能超过20个');
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // 添加新图片
    async addIntroImageItem(event) {
        const file = event.target.files[0]
        this.setState({
            file,
        });

        try {
            const filePath = await this.props.uploadImage(file,"channelLogo");
            this.setState({
                filePath: filePath,
            });
            if (filePath) {
                this.addIntroItem("image",filePath);
            }


        } catch (error) {
            console.log(error);
        }

    }

    showConfirmBox(){
        this.refs.dialogComfirm.show();
    }
    showCancelBox(){
        this.refs.dialogCancel.show();
    }
    cancelChange(tag){
        if(tag=="confirm"){
            // this.props.router.push('/wechat/page/channel-intro-list/'+this.props.params.channelId);
            this.props.router.go(-1);
        }
    }

    render() {
        return (
            <Page title="编辑介绍" className='channel-intro-edit flex-body'>
                <div className="top-menu-bar flex-other">
                    <span onClick={this.handleAddImageClick.bind(this)} className="item-add-image">添加图片
                        {this.canImageUpload() ?
                            <FileInput
                                name='channel-portrait'
                                className = "input-image"
                                onChange={this.addIntroImageItem.bind(this)}
                            />: null
                        }
                    </span>
                    <span className="item-add-text" onClick={()=>{this.addIntroItem("text")}}>添加文字</span>

                </div>
                <div className="flex-main-s">

                    <IntroList
                        introList={this.state.channelIntroList}
                        introItemUp = {this.introItemSortUp.bind(this)}
                        introItemDown = {this.introItemSortDown.bind(this)}
                        introItemDel = {this.introItemDel.bind(this)}
                        introItemChange = {this.introItemChange.bind(this)}

                    />

                </div>
                <div className="bottom-bar flex-other">
                    <span className="btn-cancel" onClick={this.showCancelBox.bind(this)}>取消</span>
                    <span className="btn-submit" onClick={this.showConfirmBox.bind(this)}>保存</span>
                </div>

                <Confirm ref='dialogCancel'
                    onBtnClick={this.cancelChange.bind(this)}
                >
                    <span className='co-dialog-main-content'><p>确定退出编辑？</p></span>
                </Confirm>
                <Confirm ref='dialogComfirm'
                    onBtnClick={this.saveCahnnelIntro.bind(this)}
                >
                    <span className='co-dialog-main-content'><p>确定保存修改？</p></span>
                </Confirm>

            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        channelIntroList:state.channelIntro.introList,
    }
}

const mapActionToProps = {
    getChannelIntro,
    saveChannelIntro,
    getStsAuth,
    uploadImage,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelIntroEdit);
