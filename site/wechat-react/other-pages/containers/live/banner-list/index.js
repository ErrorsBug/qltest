const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router';
import { stringify } from 'querystring';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import { locationTo } from 'components/util';

import Page from 'components/page';

import BannerItem from './components/banner-item';
import { request } from 'common_actions/common';

// actions
import {
    batchSaveBanner,
    setBannerList,
    getLiveBannerList,
    isLiveAdmin,
} from '../../../actions/live';
import { uploadImage, getStsAuth } from '../../../actions/common';

import { CourseTypeConfig } from './config/custom-link-select'
import './style.scss';


@withRouter
@autobind
class BannerList extends Component {
    
    constructor(props, context) {
        super(props, context);

        this.liveId = props.router.params.liveId
    }

    state = {
        channelList: [],
        vipList:[],
        liveCampList: [],
        trainingList: [],
        topicList: [],
        bannerList: []
    }


    data = {
    }

    componentWillMount() {
    }

    async componentDidMount() {
        // share({
        //     title: '千聊-最有用的知识分享平台',
        //     timelineTitle: '千聊-最有用的知识分享平台，海量精选课程等你来听',
        //     desc: '海量专家、老师、达人正在为您分享',
        //     timelineDesc: '海量专家、老师、达人正在为您分享', // 分享到朋友圈单独定制
        //     imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/ql-logo-2.png',
        // });
        const resultAdmin = await this.props.isLiveAdmin(this.liveId)
        if(resultAdmin && resultAdmin.state && resultAdmin.state.code === 0){
            this.isLiveAdmin = resultAdmin.data.isLiveAdmin === 'Y'
        }
        if (!this.props.bannerList) {
            const result = await this.props.getLiveBannerList(this.liveId);
            this.props.setBannerList(this.reSortList(result.data.LiveBanners));
        } else {
            this.props.setBannerList(this.reSortList(this.props.bannerList));
        }
        // 处理type为url的旧数据
        this.setState({
            bannerList: this.props.bannerList.map(item => ({
                ...item,
                type: item.type === 'url' ? 'link' : item.type
            }))
        })
        this.getList();
        this.initStsInfo();
    }

    reSortList(arr) {
        return arr.sort((a, b) => {
            return a.sortNum - b.sortNum;
        });
    }

    onDelete(sortNum) {
        window.simpleDialog({
            title: '确认删除此图片？',
            onConfirm: () => {
                let list = this.state.bannerList.filter(item => item.sortNum != sortNum);
                list.map((item, index) => {
                    item.sortNum = index + 1;
                    return item;
                })
                this.setState({bannerList: list});
            }
        });
    }

    onDown(sortNum) {
        let index = 0;
        this.state.bannerList.forEach((item, i) => {
            if (sortNum == item.sortNum) {
                index = i;
            }
        })

        let arr = [...this.state.bannerList];
        let tempIndex = arr[index + 1].sortNum;
        arr[index + 1].sortNum = arr[index].sortNum;
        arr[index].sortNum = tempIndex;

        // this.props.setBannerList(this.reSortList(arr));
        this.setState({
            bannerList: this.reSortList(arr)
        });
    }

    onUp(sortNum) {
        let index = 0;
        this.state.bannerList.forEach((item, i) => {
            if (sortNum == item.sortNum) {
                index = i;
            }
        })

        let arr = [...this.state.bannerList];
        let tempIndex = arr[index - 1].sortNum;
        arr[index - 1].sortNum = arr[index].sortNum;
        arr[index].sortNum = tempIndex;

        // this.props.setBannerList(this.reSortList(arr));
        this.setState({
            bannerList: this.reSortList(arr)
        });
    }

    replaceTo(url) {
        setTimeout(function() {
            location.replace(url)
        }, 150);
    }

    async onUpdate(index) {
        const params = this.props.bannerList[index];
        params.liveId = this.liveId;
        params.isOpenVip = this.props.vipInfo.isOpenVip;
        // this.props.router.push(`/wechat/page/live-banner-editor?${stringify(this.props.bannerList[index])}`)
        locationTo(`/wechat/page/live-banner-editor?${stringify(this.props.bannerList[index])}`)
    }

    async onAdd() {
        if(this.state.bannerList.length >= 8) {
            window.toast('最多上传8张轮播图')
            return ;
        }
        const newBanner = {
            businessId: null,
            imgUrl: null,
            link: null,
            liveId: this.liveId,
            mediaId: null,
            sortNum: this.state.bannerList.length + 1,
            status: "init",
            type: null,
        }
        const list = this.state.bannerList;
        list.push(newBanner);
        this.setState({
            bannerList: list
        });
    }

    // 为每个数据添加link， 兼容旧数据
    async handleData() {
        const list = this.state.bannerList && this.state.bannerList.map(item => {
            let target = CourseTypeConfig.find(conf => conf.value == item.type)
            if(target && target.getUrl) {
                let link = target.getUrl(item.businessId, this.liveId);
                item.link = link;
            }
            return item;
        })
        return new Promise((resolve) => {
            this.setState({
                bannerList: list
            }, () => {
                resolve(this.state.bannerList);
            });
        })
    }

    async batchSaveBanner() {
        await this.handleData();
        if(this.check()) {
            let banners = this.state.bannerList.map(item => ({
                ...item,
                title: ""
            }))

            const result = await this.props.batchSaveBanner({
                liveId: this.liveId,
                liveBanners: banners
            });
    
            if (result.state.code == 0) {
                window.toast('保存成功');
                if(history.length > 0) {
                    history.go(-1);
                } else {
                    locationTo('/wechat/page/live/' + this.liveId);
                }
            }
        }
    }
    getChannel() {
        request.post({
            url: "/api/wechat/transfer/h5/channel/getPcChannelList",
            body: {
                liveId: this.liveId,
                page: 1,
                size: 9999
            }
        }).then(res => {
            if(res.state.code === 0) {
                this.setState({           
                    channelList: res.data.channelList.map(item => ({...item, label: item.name, value: item.id}))
                });
            }
        }).catch(err => {});
    }
    getTopic() {
        request.post({
            url: "/api/wechat/transfer/h5/topic/mediaTopicList",
            body: {
                liveId: this.liveId,
                page: 1,
                size: 9999
            }
        }).then(res => {
            if(res.state.code === 0) {
                this.setState({           
                    topicList: res.data.mediaTopicList.map(item => ({...item, label: item.name, value: item.topicId}))
                });
            }
        }).catch(err => {});
    }
    getTraining() {
        request.post({
            url: "/api/wechat/transfer/h5/camp/new/listCamp",
            body: {
                liveId: this.liveId,
                status: 'Y',
                page: 1,
                size: 9999
            }
        }).then(res => {
            if(res.state.code === 0) {
                this.setState({           
                    trainingList: res.data.dataList.map(item => ({...item, label: item.name, value: item.id}))
                });
            }
        }).catch(err => {});
    }
    getLiveCamp() {
        request.post({
            url: "/api/wechat/transfer/h5/camp/pcCampList",
            body: {
                liveId: this.liveId,
                displayStatus: "Y",
                page: 1,
                size: 9999
            }
        }).then(res => {
            if(res.state.code === 0) {
                this.setState({           
                    liveCampList: res.data.campList.map(item => ({...item, label: item.name, value: item.id}))
                });
            }
        }).catch(err => {});
    }

    getVip() {
        request.post({
            url: "/api/wechat/transfer/baseApi/h5/custom/vip/customViplist",
            body: {
                liveId: this.liveId,
                displayStatus: "Y",
                page: {page: 1, size: 9999},
                source: "h5"
            }
        }).then(res => {
            if(res.state.code === 0) {
                let list = [{businessId: this.liveId,id: this.liveId, type: "vip", name: "通用会员", label: "通用会员", value: this.liveId, liveId: this.liveId}]; 
                list = [...list ,...res.data.list.map(item => ({...item, label: item.name, value: item.id, businessId: item.id}))]
                this.setState({           
                    vipList: list
                });
            }
        }).catch(err => {});
    }

    getList() {
        this.getChannel();
        this.getVip();
        this.getLiveCamp();
        this.getTraining();
        this.getTopic();
    }

    onTypeChange([type], sortNum) {
        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum === sortNum);
        if(target) {
            target.type = type;
            target.businessId = null;   
            target.link = null;
        }
        this.setState({
            bannerList: newList
        });
    }

    onCourseSelect(type,sortNum, [bid], link) {
        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum == sortNum);
        if(target) {
            target.businessId = bid;
            target.link = link;
        }
        this.setState({
            bannerList: newList
        });
    }
    
    onUrlChange(sortNum, url) {
        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum == sortNum);
        if(target) {
            target.link = url;
        }
        this.setState({
            bannerList: newList
        });    
    }

    onSelectPage(sortNum,link,businessId) {
        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum == sortNum);
        if(target) {
            target.link = link;
            target.businessId = businessId;
        }
        this.setState({
            bannerList: newList
        });
    }

    onVipChange(sortNum, bid, link) {
        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum == sortNum);
        if(target) {
            target.link = link;
            target.businessId = bid;
        }
        this.setState({
            bannerList: newList
        });
    }

    async onChangeFile(sortNum, event) {
        const file = event.target.files[0]

        const newList = this.state.bannerList;
        let target = newList.find(item => item.sortNum == sortNum);
        if(target) {
            try {
                const filePath = await this.props.uploadImage(file, "channelLogo");
                target.imgUrl = filePath;
                this.setState({
                    bannerList: newList
                });    
            } catch (error) {
                console.log(error);
            }
        }
    }

    // oss上传
    initStsInfo() {
        this.props.getStsAuth();

        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    check() {
        for(let i = 0; i < this.state.bannerList.length; i ++) {
            const { imgUrl, type, link, businessId } = this.state.bannerList[i];
            const reg = /((http|https):\/\/)(\w|\/|\.|-|:|\%)*(\.(com|cn|html|htm|net|org))+(\w|\/|\.|-|:|\%)*(\?+(\w)*.+(\w|\%)*(&+(\w)*.+(\w|\%)*)?)?/gi;
    
            if(!imgUrl) {
                window.toast("未上传图片")
                return false;
            }
            
            if (!type) {
                window.toast("未选择类型");
                return false;
            } 
    

            if (!link && type !== 'none') {
                window.toast("链接不能为空");
                return false;
            }
    
            if (link && type === 'url') {
                if (!reg.test(link)) {
                    window.toast("链接填写错误, 请输入以 http:// 或 https:// 为开头的完整链接");
                    return false;
                }
            }

            let flag = false;
            switch(type) {
                case "topic":
                    
                    if(!this.state.topicList.find(item => {console.log(item.topicId ,businessId);return item.topicId == businessId})) {
                        flag = true;
                    }
                    break;
                case "channel":
                    if(!this.state.channelList.find(item => item.id == businessId)) {
                        flag = true;
                    }
                    break;
                case "liveCamp":
                    if(!this.state.liveCampList.find(item => item.id == businessId)) {
                        flag = true;
                    }
                    break;
                case "training":
                    if(!this.state.trainingList.find(item => item.id == businessId)) {
                        flag = true;
                    }
                    break;
                case "vip":
                    if(!this.state.vipList.find(item => item.id == businessId)) {
                        flag = true;
                    }
                    break;
                default:
                    break;
            }
            if(flag) {
                window.toast("请选择课程")
                return false;
            }
        }
        return true;
    }

    render() {
        const {
            bannerList,
        } = this.state;

        return (
            <Page title={"轮播图列表"} className='banner-list-container'>
                <div className='banner-list'>
                    {
                        bannerList && bannerList.map((item, index) => (
                            <BannerItem
                                key={`banner-item-${index}`}
                                liveId={this.liveId}
                                {...item}
                                index={index}
                                arrSize={bannerList.length}
                                onDelete={this.onDelete}
                                onDown={this.onDown}
                                onUp={this.onUp}
                                onUpdate={this.onUpdate}
                                channelList={this.state.channelList}
                                topicList={this.state.topicList}
                                vipList={this.state.vipList}
                                trainingList={this.state.trainingList}
                                liveCampList={this.state.liveCampList}
                                typeArr={CourseTypeConfig}
                                onTypeChange={this.onTypeChange}
                                onCourseSelect={this.onCourseSelect}
                                onUrlChange={this.onUrlChange}
                                onSelectPage={this.onSelectPage}
                                onVipChange={this.onVipChange}
                                onChangeFile={this.onChangeFile}
                            />
                        ))
                    }
                </div>

                {
                    (!bannerList || bannerList.length === 0) && 
                        <p className='empty-tip'>暂无轮播图，请点击左下角添加</p>
                }

                <div className='bottom-btns'>
                    <span className='btn-add' onClick={ this.onAdd }> <span className='icon_plus'></span> 添加</span>
                    <span className='btn-save' onClick={ this.batchSaveBanner }>保存</span>
                </div>
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        bannerList: state.live.mgrBannerList,
        vipInfo: state.live.vipInfo,
    }
}

const mapActionToProps = {
    batchSaveBanner,
    setBannerList,
    getLiveBannerList,
    isLiveAdmin,
    uploadImage,
    getStsAuth
}

module.exports = connect(mapStateToProps, mapActionToProps)(BannerList)
    