import React, { PureComponent } from 'react'
import { CSSTransition } from 'react-transition-group'
import HandleAppFunHoc from 'components/app-sdk-hoc'

/**
 * 用于h5内app分享效果，包含图片保存、微信分享、微信朋友圈分享
 * @export
 * @class AppShare
 * @extends {PureComponent}
 */
@HandleAppFunHoc
export class AppShare extends PureComponent {
    handleAppFun = (num) => {
        const { url } = this.props;
        if(num == 1){
            this.props.handleAppSdkFun('saveImage', {
                saveImage: url,
                callback: (res) => {
                    this.props.setShowButton()
                },
            })
        }
        if(num == 2){
            this.props.handleAppSdkFun('shareImageToWeChat', {
                shareImageToWeChat: url,
                callback: (res) => {
                    this.props.setShowButton()
                }
            })
        }
        if(num == 3){
            this.props.handleAppSdkFun('shareImageToWeChatCircle', {
                shareImageToWeChatCircle: url,
                callback: (res) => {
                    this.props.setShowButton()
                }
            })
        }
    }
    render() {
        const { isAppShare, setShowButton } = this.props;
        return (
            <CSSTransition
                in={isAppShare}
                timeout={800}
                classNames="un-app-show"
                unmountOnExit
                onExited={setShowButton}>
                <div className="un-app-show">
                    <div className="un-app-com icon-save" onClick={ () => this.handleAppFun(1) }>
                        <p>保存到相册</p>
                    </div>
                    <div className="un-app-com icon-wx" onClick={ () => this.handleAppFun(2) }>
                        <p>微信</p>
                    </div>
                    <div className="un-app-com icon-friend" onClick={ () => this.handleAppFun(3) }>
                        <p>朋友圈</p>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}