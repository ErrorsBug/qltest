import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { Confirm} from 'components/dialog';

import { locationTo} from 'components/util';

class LiveVipSettingTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 有id为定制vip，无id为通用vip
            liveId: props.location.query.liveId,
        }
    }

    gotoCustomized = (e)=> {
        this.refs.dialogConfirm.show();
    }


    render() {
        return (
            <Page title="直播间会员设置" className='live-vip-setting-types'>
                <div className="vip-card-list" >
                    <div className="item honour"
                        onClick={() => {
                            locationTo(`/wechat/page/live-vip-setting?liveId=${this.state.liveId}`)
                        }}
                    >
                        <span className="tips">
                            <b>按时长收费，有效期内畅听所有课程</b>
                            <i className="icon_enter"></i>    
                        </span>
                    </div>
                    <div className="item customized"
                        onClick={this.gotoCustomized}
                        >
                        <span className="tips">
                            <b>打包内容，有效期内畅听指定课程</b>
                            <i className="icon_enter"></i> 
                        </span>
                    </div>
                </div>


                 {/*消息确认弹框*/}
                 <Confirm
                    ref='dialogConfirm'
                    title='定制会员设置'
                    buttons = 'cancel'
                    cancelText='我知道了'
                    className='goto-customized'
                    // titleTheme = { this.state.titleTheme }
                >

                    <main className='dialog-main'>
                        请到pc直播间管理后台，点击左侧菜单<span>【课程列表】-【会员列表】</span>进行操作<br />
                        访问地址：<a className="underline" href='http://v.qianliao.tv'>v.qianliao.tv</a><br />
                        不知道怎么操作？<a href='http://t.cn/Rmo4iKI'>点击查看教程</a>
                    </main>
                </Confirm>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
    }
}

const mapDispatchToProps = {

}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LiveVipSettingTypes)