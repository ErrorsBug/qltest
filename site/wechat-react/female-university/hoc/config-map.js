import React, { Component } from 'react'
import { initConfig } from '../actions/home'

/**
 * 女大通用配置数据
 * @param {*} WrappedComponent
 * @returns
 */
const ConfigMap = (WrappedComponent) => {
    return class extends Component {
        state = {
            configInfo: {},
        }
        componentDidMount() {
            this.initData();
        }
        async initData(){
            const res = await initConfig({ businessType: "UFW_CONFIG_KEY"});
            this.setState({
                configInfo: res || {}
            })
        }
        render() {
            return (
                <WrappedComponent { ...this.props } { ...this.state } />
            )
        }
    }
}
export default ConfigMap