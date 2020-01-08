import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import PressHoc from 'components/press-hoc';
import { getUrlParams } from 'components/url-utils';
import { getSaleQr } from '../../actions/home'
import { getIntentionCamp } from '../../actions/home'
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc
@AppEventHoc
@autobind
class UniversityExperienceSuccess extends Component {
    state = {
        url: "",
        campObj: {},
    }
    get campId(){ 
        return getUrlParams('campId', '')
    }
    async componentDidMount() { 
        this.initData()
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.paySuccess()
        })
    }
    // 获取导购图列表
    initData = async () => {  
        const { data, state } = await getIntentionCamp({
            campId: this.campId,
        }) 
        if(data) {
            this.setState({
                campObj: data.camp || {},
            })
        } else {
            window.toast((state && state.msg) || '请求异常')
        }
    }

    // 调用app一次性订阅
    sendAppSubscribe(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleAppSdkFun('commonSubscribeMessage', {
            type: 'ufw_camp', 
            pushData: {
                campId: Number(this.campId),
            },
            callback: () => {

            }
        })
    }

    render(){
        const { campObj } = this.state;
        return (
            <Page title="报名成功" className="exp-success-box">
                <section className="scroll-content-container">
                    <div className="exp-success-bg">
                        <img src="https://img.qlchat.com/qlLive/activity/image/LNKX7AL7-OZ2H-TKBV-1574058126067-FLAIIBEJ3T3Y.png" alt=""/>
                        <div className="exp-successc-cont">
                            <h4>恭喜，您已成功加入</h4>
                            <p>{campObj.title}</p>
                            <div className="exp-successc-observer">
                                <h3>请务必添加老师微信</h3>
                                <h3>否则无法正常学习!</h3>
                                <span className="iconfont iconwangxia"></span>
                                <div className="exp-successc-btn" onClick={ this.sendAppSubscribe }>点击添加老师微信</div>
                            </div>
                        </div>
                    </div>
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(UniversityExperienceSuccess);