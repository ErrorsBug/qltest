import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import {
    locationTo,
} from 'components/util';

// 加入珊瑚计划引导弹框
class CoralJoinBox extends Component {
    componentDidMount() {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }
 
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                close={true}
                closeStyle="btn-close-ui icon_cancel"
                className="coral-join-dialog"
                onClose={this.props.onClose}
                trackCloseBtnModel={{
                    name: '弹窗-会员',
                    region: "window",
                    pos: "close",
                }}
            >
            {
                this.props.isCoralJoin
                ?
                <img 
                    className ="coral-join-box on-log on-visible" 
                    data-log-name="弹窗-非会员"
                    data-log-region="window"
                    data-log-pos="click"
                    src={this.props.memberBounceUrl} 
                    onClick={this.props.onJoin} 
                />
                :
                <div className ="coral-joined-box">
                    <span  className="btn-join" onClick={()=>{
                        window.localStorage.removeItem("coralJoinBoxShow");
                        locationTo("http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000000453668208")
                        }}>获取培训群二维码
                    </span>
                    <img className="head-img" src={`${this.props.headImgUrl}`}/>
                </div>
            }
            </MiddleDialog>
        );
    }
}

CoralJoinBox.propTypes = {

};

export default CoralJoinBox;