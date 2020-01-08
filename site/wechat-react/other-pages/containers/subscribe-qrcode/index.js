import React, { Component } from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import Page from 'components/page';
import Detect from 'components/detect';
import { onQrCodeTouch } from 'components/util';
import {isPc} from 'components/envi';

//actions
import {
    fetchGetQr,
} from '../../actions/live';

class SubscribeQrcode extends Component {
    state = {
        isPC: false,
    }
    componentWillMount() {
        var isPC = isPc();

        this.setState({
            isPC
        });
    }
    componentDidMount() {
        this.getQrFunc();
    }
    async getQrFunc(){
        var result = await this.props.fetchGetQr("207")
        if (result.state &&  result.state.code == '0') {
            this.setState({
                    qrcodeUrl:result.data.qrUrl
            })
        }
    }
    render() {
        return (
            <Page title="定制课程" className="subscribe-qrcode-container">
               <h2 className="header-title">每周二、周五上课</h2>
               <div className="qrcode-container">
                   <section className="qrcode-header">还差最后一步</section>
                   <section className="qrcode-box">
                       <div className="qrcode">
                           <img src={this.state.qrcodeUrl} 
                           style={{/*pointerEvents: !Detect.os.phone && 'none'*/}}
                            onTouchStart={ (e)=>{onQrCodeTouch(e,".qrcode")}}
                            />
                       </div>
                       <div className="tips">
                           <p>{this.state.isPC ? "扫描":"长按"}识别二维码</p>
                           <p>即可开启上课计划</p>
                       </div>
                   </section>
               </div>
               {
                this.state.isPC ?
                    <div className="linkto"><a href="/wechat/page/dingzhi">已扫描，开启上课</a></div>
                    :
                    null
               }
               
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        
    };
}

const mapActionToProps = {
    fetchGetQr,
};

module.exports = connect(mapStateToProps, mapActionToProps)(SubscribeQrcode);