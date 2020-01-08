import React,{Component} from 'react';
import Page from 'components/page';
import {connect} from 'react-redux';

import { locationTo, updateUrl } from 'components/util';
import { fillParams } from 'components/url-utils';

import { getSimpleTopic } from 'actions/topic';
import { getSimpleChannel } from 'actions/channel';

import { Confirm } from 'components/dialog';

import { giftValidate, giftCourseList, choseGift, giftAvailable, configsByCode } from '../../actions/activity-common'

function mapStateToProps(state) {
    return {};
}
const mapDispatchToProps = {
    getSimpleTopic,
    getSimpleChannel,

    giftAvailable,
    choseGift,
    giftCourseList,
    giftValidate,
    configsByCode,
};

class ActivityGift extends Component {
    constructor(props){
        super(props);
        this.channelId = props.location.query.channelId;
        this.actId = props.location.query.actId;
    }

    state = {
        courseName: '',
        des: "",

        showGift: false,
        isBuyActivityCourse: false,
        isGetGift: false,

        // 活动赠礼
        giftList: [],
        chosenGift: null,
        btnText: "请选择图中赠品"
    };

    componentDidMount() {

        // setTimeout(() => {
        //     this.initCompatibility(".activity-gift-container, .scroll-x")
        // }, 150);
        this.initCourseData()

    }

    initCompatibility = (fixScrollSelector) => {
        //* 各种兼容处理 *//
        // 解决IOS漏底问题
        function disableScroll(event) {
            if (!event.canScroll) {
                event.preventDefault();
            }
        }
        function overscroll(el) {
            if (el) {
                el.addEventListener('touchstart', function (){
                    var top = el.scrollTop;
                    var totalScroll = el.scrollHeight;
                    var currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                });

                el.addEventListener('touchmove', function(event) {
                    if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
                });
            }
        }
        function fixScroll(selector) {
            var elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }
        fixScroll(fixScrollSelector);
    }

    initCourseData = async () => {
        let [channel, courseList, actCourse, giftValidate, isJoin, configsByCode] = await Promise.all([
            this.props.getSimpleChannel(this.channelId),
            this.props.giftCourseList({
                activityCode: this.actId,
                groupCode: "course",
            }),
            this.props.giftCourseList({
                activityCode: this.actId,
                groupCode: "giftList",
            }),
            this.props.giftValidate({
                courseList: [{
                    businessType: "channel",
                    businessId: this.channelId
                }]
            }),
            this.props.giftAvailable({
                activityCode: this.actId
            }),
            this.props.configsByCode({
                activityCode: this.actId,
                codeList: ["icon", "title", "content"]
            })
        ]) 

        console.log("giftValidate");
        console.log(giftValidate.data.dataList[0].available);

        console.log("isJoin");
        console.log(isJoin.data.isJoin);

        console.log("configsByCode");
        console.log(configsByCode.data);

        let [iconImg, iconTitle, des] = ["", "", ""]

        if (configsByCode.data && configsByCode.data.dataList && configsByCode.data.dataList.length > 0) {
            configsByCode.data.dataList.map((item) => {
                switch(item.code) {
                    case "icon":
                        iconImg = item.icon
                        break
                    case "title":
                        iconTitle = item.content
                        break
                    case "content":
                        des = item.content
                        break
                    default:
                        break
                }
            })
        }

        if(actCourse.data.dataList[0].businessId != this.channelId) {
            this.setState({
                des: "无效的系列课",
                canReceiveGift: false,
            })
            return
        }

        this.setState({
            iconImg: iconImg,
            iconTitle: iconTitle,
            des: des,
        })

        if(giftValidate.data.dataList[0].available != "Y") {

            courseList = courseList && courseList.data && courseList.data.dataList
            let giftList = []
            courseList.length > 0 && courseList.map((item) => {
                giftList.push({
                    businessType: item.businessType,
                    giftImgUrl: item.headImage + '@296h_480w_1e_1c_2o',
                    businessId: item.businessId,
                    corseName: item.name,
                    available: false,
                    unavailableMsg: '',
                    checked: false,
                })
            })
            
            let courseName = channel && channel.data && channel.data.channel && channel.data.channel.name 
            this.setState({
                // des: "请购课后领取，点击按钮跳转至系列课介绍页",
                canReceiveGift: false,
                showGift: true,
                courseName: courseName,
                isBuyActivityCourse: false,
                isGetGift: false,
                jumpToCourseType: "channel",
                jumpToCourseId: this.channelId,
                giftList,
            })

            return
        }

        if(isJoin.data.isJoin != "N") {

            courseList = courseList && courseList.data && courseList.data.dataList
            let giftList = []
            courseList.length > 0 && courseList.map((item) => {
                giftList.push({
                    businessType: item.businessType,
                    giftImgUrl: item.headImage + '@296h_480w_1e_1c_2o',
                    businessId: item.businessId,
                    corseName: item.name,
                    available: false,
                    unavailableMsg: '',
                    checked: false,
                })
            })
            
            let courseName = channel && channel.data && channel.data.channel && channel.data.channel.name 
            this.setState({
                // des: "赠礼已领取，点击按钮跳转至赠礼课程",
                canReceiveGift: false,
                showGift: true,
                courseName: courseName,
                isBuyActivityCourse: true,
                isGetGift: true,
                jumpToCourseType: isJoin.data.resultType,
                jumpToCourseId: isJoin.data.result,
                giftList,
            })

            return
        }



        // 有效
        courseList = courseList && courseList.data && courseList.data.dataList
        let giftList = []
        courseList.length > 0 && courseList.map((item) => {
            giftList.push({
                businessType: item.businessType,
                giftImgUrl: item.headImage + '@296h_480w_1e_1c_2o',
                businessId: item.businessId,
                corseName: item.name,
                available: null,
                unavailableMsg: '',
                checked: false,
            })
        })

        let giftCourseListValidate = await this.props.giftValidate({
            courseList: giftList
        })

        giftCourseListValidate = giftCourseListValidate && giftCourseListValidate.data && giftCourseListValidate.data.dataList || {}
        console.log(giftCourseListValidate);
        giftCourseListValidate.map((item, index) => {
            if(item.available == 'N') {
                giftList[index].available = true
            } else if(item.available == 'Y') {
                giftList[index].available = false
                giftList[index].unavailableMsg = '已经拥有此课程'
            }
        })
        
        let courseName = channel && channel.data && channel.data.channel && channel.data.channel.name 

        this.setState({
            canReceiveGift: giftValidate.data.dataList[0].available == "Y",
            showGift: true,
            courseName: courseName,
            isBuyActivityCourse: true,
            isGetGift: false,
            giftList,
        })
    }



    giftChoseHandle = (chosenItem) => {
        if(!this.state.canReceiveGift || !chosenItem.available) {
            return 
        }

        this.state.giftList.map((item) => {
            if(item.businessId == chosenItem.businessId) {
                item.checked = true
            } else {
                item.checked = false
            }
        })

        this.setState({
            giftList: this.state.giftList,
            chosenGift: chosenItem,
        })
    }

    giftDialogBtnHandle = async (tag) => {
        if(tag == "confirm") {

            const result = await this.props.choseGift({
                activityCode: this.actId,
                type: this.state.chosenGift.businessType,
                id: this.state.chosenGift.businessId,
            })

            if(result && result.state.code === 0) {
                window.toast("领取成功")
            } else {
                window.toast("领取失败，请稍后再试")
            }

            setTimeout(() => {
                location.href = updateUrl(location.href)
            }, 200);

            this.refs.giftDialog.hide()
        }
    }

    onCloseGiftTipDialog = () => {
        this.refs.giftDialog.hide()
    }

    giftTypeText = (giftItem) => {
        switch (giftItem && giftItem.businessType) {
            case "channel":
                return "系列课"
            case "topic":
                return "话题"
            default:
                break;
        }
    }

    jumpToCourse = () => {
        let url = ""
        switch(this.state.jumpToCourseType) {
            case "channel": 
                url = "/live/channel/channelPage/" + this.state.jumpToCourseId + ".htm"
                break;
            case "topic": 
                url = "/wechat/page/topic-intro?topicId=" + this.state.jumpToCourseId
                break;
            default:
                return
        }

        let ch = this.props.location.query.ch 
        let actId = this.props.location.query.actId

        if(ch) {
            url = fillParams({ch: ch}, url)
        }
        if(actId) {
            url = fillParams({actId: actId}, url)
        }
        url = fillParams({orderNow: 'Y'}, url)

        locationTo(url)
    }

    render() {

        const btnRender = () => {
            if(!this.state.isBuyActivityCourse) {
                return (<div className="gift-btn chosen" onClick={this.jumpToCourse}>请购课后领取</div>)
            }
            if(this.state.isBuyActivityCourse && !this.state.isGetGift) {
                return (<div className="gift-btn">请选择图中赠品</div>)
            }
            if(this.state.isBuyActivityCourse && this.state.isGetGift) {
                return (<div className="gift-btn chosen" onClick={this.jumpToCourse}>赠礼已领取</div>)
            }
        }

        return(
            <Page title="赠礼领取" className='activity-gift-container'>
                <div className='gift-header'>
                    <div className="icon-gift">
                        <img src={this.state.iconImg} alt=""/>
                    </div>

                    <p className="title">{this.state.iconTitle}</p>
                    <p className="des">{this.state.des}</p>

                </div>

                {
                    this.state.showGift && <div className="des-con">
                        <span className="type">课程名称：</span>
                        <span className="course">{this.state.courseName}</span>
                    </div>
                }

                {
                    this.state.showGift &&  <div className='gift-con'>
                        <div className="scroll-x">
                            {
                                this.state.giftList.map((item, index) => {
                                    return (
                                        <div className='gift-item-con' key={'gift' + index} onClick={() => {this.giftChoseHandle(item)}}>
                                            { 
                                                !item.available && <div className='unavailable-layer'>{item.unavailableMsg}</div>
                                            }
                                            {
                                                item.available && <div className={`check-tag icon_checked${item.checked ? " checked" : ""}`}></div>
                                            }
                                            {
                                                <div className="gift"><img src={item.giftImgUrl} alt=""/></div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            this.state.chosenGift ?
                                <div className="gift-btn chosen" onClick={() => {this.refs.giftDialog.show()}}>点击领取</div>
                            :   
                                 this.state.showGift && btnRender()
                        }
                        
                    </div>
                }


                <Confirm
                    ref='giftDialog'
                    theme='empty'
                    onClose={this.onCloseGiftTipDialog}
                    onBtnClick={this.giftDialogBtnHandle}
                    buttons='cancel-confirm'
                    confirmText="领取"
                >
                {
                    this.state.chosenGift && <main className='gift-dialog-container'>
                        <img src={this.state.chosenGift.giftImgUrl}></img> 
                        <p>
                            选择{this.giftTypeText(this.state.chosenGift)}《{this.state.chosenGift.corseName}》作为您的赠礼？
                        </p>
                    </main>
                }

                </Confirm>


            </Page>
        )
    }
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(ActivityGift);