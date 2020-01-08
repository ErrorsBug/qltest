const isNode = typeof window == 'undefined';

import React, {Component} from 'react';

import Confirm from 'components/dialog/confirm';

class ShareDialog extends Component {
    data = {
        show:false
    }
    showShare(type) {
        // this.setState({
        //     show:!this.data.show
        // })
        this.data.show = type;
        if(this.data.show){
            this.refs.shareDialog.show();
        }else{
            this.refs.shareDialog.hide();
            this.props.hideShare();
        }
    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.show);
       if(nextProps.show != this.data.show){
            this.showShare(nextProps.show);
       }
    }
    render() {
        return (
            <Confirm ref='shareDialog' 
                 buttons={this.props.buttons} 
                 cancelText='关闭' 
                 className='channel-distribution-list-share-dialog-container'
                 onClose={this.props.hideShare.bind(this)}
                >
                <div className='share-dialog-content'>
                    <span className='cl-blue'>不要关闭此弹框</span>
                    <span className='cl-grey'>，点击页面右上角<span className='icon_dots_horizontal'></span>选择</span>
                    <span className='icon-share-friends'></span>
                    <span className='cl-black'>发送给好友</span>
                    {/* <span className='cl-grey'>或</span>
                    <span className='icon-share-circle'></span>
                    <span className='cl-black'>朋友圈</span> */}
                </div>
            </Confirm>
        );
    }
}



export default ShareDialog;