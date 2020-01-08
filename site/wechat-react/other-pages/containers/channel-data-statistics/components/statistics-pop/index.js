import React, { Component, Fragment } from 'react';
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom';
// 帮助弹窗类型 none|baseApproach|popularizeApproach|tooMoreChannel   none为不显示

class StatisticsPop  extends Component {
    state = {
        title: "",
        content: [],
        bottom: [],
        inputContent: "",
    }
    data= {
        showTips: true
    }
    closeHandel = (e) => {
        this.props.popHandel("none")
        this.data.showTips = true;
    }

    
    updateContent = () => {
        switch(this.props.type) {
            case "courseIndex" : 
                this.setState({title: "课程指数"})
                break;
            case "topicBaseData" :
                this.setState({
                    title: "基本数据",
                    content: [
                        {
                            pre: "课程收入：",
                            body: "课程的销售额"
                        },
                        {
                            pre: "访问人数：",
                            body: "访问课程介绍页的人数"
                        },
                        {
                            pre: "报名人数：",
                            body: "报名课程的人数"
                        },
                        {
                            pre: "报名率：",
                            body: "报名人数/访问人数"
                        },
                        {
                            pre: "听课人数：",
                            body: "进入课程详情页听课的人数"
                        },
                        {
                            pre: "听课率：",
                            body: "听课人数/报名人数"
                        },
                        {
                            pre: "完播率：",
                            body: "用户听课总时长/(报名用户数X课程总时长)",
                            styles: {
                                color:'#f73657'
                            }
                        },
                        {
                            pre: "分享率：",
                            body: "分享人数/访问人数"
                        }
                    ],
                    showInput: false,
                })
                break;
            case "distribution":
                this.setState({
                    title: "分销数据",
                    content: [
                        {
                            pre: "有效分销用户数：",
                            body: "有产生分销订单的用户数"
                        },
                        {
                            pre: "用户分销分成：",
                            body: "分销用户所得分成收入"
                        },
                    ],
                    showInput: false, 
                })
                break;
            case "gift":
                this.setState({
                    title: "赠礼数据",
                    content: [
                        {
                            pre: "赠礼收入：",
                            body: "课程赠礼的销售额"
                        },
                        {
                            pre: "购买人数：",
                            body: "购买赠礼的人数。"
                        },
                    ],
                    showInput: false, 
                })
                break;
            case "other":
                this.setState({
                    title: "其他",
                    content: [
                        {
                            pre: "赞赏收入：",
                            body: "课程赞赏的收入"
                        },
                        {
                            pre:"文件收入：",
                            body:"课程文件的销售额" 
                        },
                        {
                            pre:"转播费收入：",
                            body:"转播费的销售额" 
                        },
                        {
                            pre:"转播分成收入：",
                            body:"转播课程的分成收入" 
                        },
                        {
                            pre:"转播次数：",
                            body: "转播此课程的直播间数"
                        },
                    ],
                    showInput: false, 
                })
                break;
            case "popularizeApproach":
                this.setState({
                    title: "推广渠道",
                    content: [
                        {
                            pre: "",
                            body: "1.推广渠道可以统计推广链接带来的访客数据"
                        },
                        {
                            pre: "",
                            body: "2.每个课程默认有5个推广渠道，如需增加点击【新增推广渠道】，最多支持50个；"
                        },
                        {
                            pre: "",
                            body: "3.长按复制，将链接插入到公众号文章阅读原文，或生成二维码。"
                        },
                        // "1.推广渠道可以统计推广链接带来的访客数据；",
                        // "2.每个课程默认有5个推广渠道，如需增加点击【新增推广渠道】，最多支持50个；",
                        // "3.长按复制，将链接插入到公众号文章阅读原文，或生成二维码。"
                    ],
                    showInput: false,
                })
                break;
            case "baseApproach":
                this.setState({
                    title: "基础渠道",
                    content: [
                        {
                            pre: "默认渠道：",
                            body: "通过非指定渠道带来的用户；"
                        },
                        {
                            pre: "邀请卡：",
                            body: "通过邀请卡带来的用户；"
                        },
                        {
                            pre: "分享链接：",
                            body: "通过分享链接带来的用户；"
                        },
                        {
                            pre: "课程推送：",
                            body: "通过课程推送通知功能带来的用户。"
                        },
                        {
                            pre: "直播中心：",
                            body: "通过千聊首页带来的用户。"
                        },
                    ],
                    showInput: false, 
                })
                break;
           
            case "tooMoreChannel":
                this.setState({
                    title: "太多啦",
                    content: [
                        {
                            pre: "",
                            body:  "推广渠道不得多于20条",
                        }
                    ],
                    showInput: false, 
                })
                break;
            case "modify" :
                this.setState({
                    title: "推广渠道名称",
                    content: [],
                    showInput: true, 
                })
                break;
        }
    }

    modifyHandel = (e) => {

        let str = e.target.value.replace(/\s+/g,""); 
            this.props.modifyHandel(str)
        
        if (str.length > 10 && this.data.showTips) {
            window.toast("渠道名不能超过十个字")
            this.data.showTips = false;
        }
    }
    commitModifyHandel = () => {
        
        if(!this.props.modifyName) {
            window.toast("名称不能为空");
        } else if(this.props.modifyName.length > 10){
            window.toast("渠道名不能超过十个字")
        } else {
            this.props.commitModify()
            this.refs.modify.value = ""
        }
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     // console.log("current:    " + this.props.modifyName);
    //     // console.log("next:    "+nextProps.modifyName);
    //     // if (this.props.modifyName != nextProps.modifyName ) {
    //     //     return true;
    //     // }
    //     if (this.props === nextProps && this.state.title === nextState.title) {
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.type !== this.props.type) {
            this.updateContent()
        }
       
    }
    

    render() {
        const node = document.querySelector('.portal-middle');
        if (!node) {
            return null;
        }
        return createPortal(
            <MiddleDialog
                show={this.props.type !== "none"}
                close={true}
                bghide={true}
                className="dialog-data-statistics"
                onClose={this.closeHandel}
                title={this.state.title}
            >
                <div className="content">
                    {/* 课程指数的弹窗内容结构不一样，所以要这么写 */}
                    {
                        this.props.type == 'courseIndex' ? 
                        [
                            <div className="course-index-pop-content">
                                <div className="l-title">1.课程指数</div>
                                <p>课程指数用来衡量该课程在千聊平台的综合表现。</p>
                                <p>从高到低分为SABCD五个等级。为老师提供重要参考。</p>
                                <p>课程指数仅直播间创建者和管理员可查看，不向学员展示。</p>
                            </div>,
                            <div className="course-index-pop-content">
                                <div className="l-title">2.课程指数构成</div>
                                <p>（指数低于D或系列课内非单独售卖单课，指数为无）</p>
                                <p>课程指数由下列指标综合评定得出，仅课程有大于等于30人报名时会计算课程指数。</p>
                                <p>每项指标都很重要：</p>
                                <p>-完播率：收听课程时长/总课程时长</p>
                                <p>-听课率：听课人数/报名人数</p>
                                <p>-报名率：下单人数/访问人数</p>
                                <p>-评分：课程评分</p>
                            </div>
                        ] : 
                        <Fragment>
                            {
                                this.state.content.map((item , index) => {
                                    return (
                                        <div className="text" style={item.styles} key={index}>
                                            <span className="pre">{item.pre}</span> 
                                            <span>{item.body}</span>
                                        </div>
                                    )

                                })
                            }   
                            {
                                this.state.showInput ?
                                <input ref="modify" className="modify-textarea" placeholder={this.props.modifyName ? this.props.modifyName : "请输入修改渠道名称"} onChange={this.modifyHandel}></input> 
                                :
                                <>
                                <div className="text tips">注：</div>    
                                <div className="text tips">1. 数据每小时更新一次</div>    
                                </>
                            }
                            {
                                (!this.state.showInput && this.props.type == 'topicBaseData') ?
                                <>
                                    <div className="text tips">2. 分享率数据从2018年9月10日开始统计</div>  
                                    <div className="text tips">3. 完播率数据从2019年9月30日更改了统计口径</div>  
                                    <div className="text min-tips">旧版完播率=用户听课时长/已听课用户所听过的课程的总时长</div>  
                                    <div className="text min-tips">新版完播率=用户听课时长/(报名用户数x课程总时长)</div>  
                                </>
                                :
                                null    
                            }
                        </Fragment>
                    }
                </div>
                {
                    this.props.type == "modify" ?
                    (
                        <div className="bottom">
                            <div className="bottom-text close"  onClick={this.closeHandel}>取消</div>
                            <div className="bottom-text red" onClick={this.commitModifyHandel}>确定</div>
                        </div>
                    ) 
                    : 
                    (
                        <div className="bottom">
                            <div className="bottom-text red close"  onClick={this.closeHandel} >知道了</div>
                        </div>
                    )
                } 
            </MiddleDialog>,
            node
        );
    }
}

export default StatisticsPop;