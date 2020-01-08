import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import { isWeixin } from 'components/envi';

@autobind
class SuccessDialog extends Component {

    state = {
    }


    switcDialog(){
        if (isWeixin()) {
            location.href = `/wechat/page/backstage`
        } else {
            location.href = `/video/admin/live/home?liveId=${this.liveId}`
        }
    }


    render() {

        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
        }

        return (
            createPortal(
                <MiddleDialog 
                    show={true}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="introduction-org-dialog"
                    onClose={this.switcDialog}
                    title=''>
                        <div className="id-close-modal" onClick={this.switcDialog} ></div>    
                        <div className="introduction-success-dialog">
                            <span className="icon_choosethis"></span>
                            <span className="content">支付成功</span>
                        <span className="btn-goto" onClick={()=>{locationTo('http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000002300146349')}}>加入专属服务群</span>
                        </div>
                </MiddleDialog>
            , portalBody)
        );
    }
}

SuccessDialog.propTypes = {

};

export default SuccessDialog;