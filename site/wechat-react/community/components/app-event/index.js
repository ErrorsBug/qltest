import React, { Component, Fragment } from 'react'
import { isQlchat } from 'components/envi'
import appSdk from 'components/app-sdk'
import { AppShare } from './app-share'

/**
 * 集成app分享、app分享朋友圈、是否为app
 * @param {*} WrappedComponent
 * @returns
 */
const AppEventHoc = (WrappedComponent) => {
    return class extends Component{
        state = {
            isAppShare: false,
            url: ''
        }
        isLoading = false
        setShowButton = () => {
            this.setState({
              isAppShare: false
            })
        }
        // 长按时显示
        onPress = (flag = true) => {
            this.setState({
                isAppShare: flag
            })
        }
        // 获取画卡图片链接传递给APP
        getCardUrl = (url) => {
            if(this.isLoading) return false
            this.isLoading = true
            this.setState({
                url: url
            }, () => {
                this.isLoading = false
            })
        }
        render() {
            return (<Fragment>
                <WrappedComponent 
                { ...appSdk }
                getCardUrl={ this.getCardUrl }
                onPress={ this.onPress }
                isQlchat={ isQlchat() }
                { ...this.props } />
                <AppShare setShowButton={ this.setShowButton } url={ this.state.url } isAppShare={ this.state.isAppShare }/>
            </Fragment>)
        }
    }
}

export default AppEventHoc