import React, { Component } from 'react'
// import ScrollToLoad from 'components/scrollToLoad'
import { request } from 'common_actions/common'
import { getUrlParams } from 'components/url-utils'

const getDisplayName = (component) => {
    return component.displayName || component.name || 'Component'
}

/**
 * 滚动加载封装
 * @param {*} { 
 *     url = '',请求链接
 *     key = 'dataList', 获取url参数的key
 *     urlParmasKey = '', 处理请求返回过来的数据
 *     handleData
 *   }
 */
const ScrollHoc = ({ 
    url = '',
    key = 'dataList', 
    urlParmasKey = '',
    handleData
  }) => (WrappedComponent) => {
    class Scroll extends Component{
        state = {
            dataList: [],
            isNoMore: false,
            isNoOne: false 
        }
        page = {
            page: 1,
            size: 20
        }
        get urlParams() {
            return getUrlParams(urlParmasKey, '')
        }
        componentDidMount() {
            this.initData();
        }
        // 初始化数据
        initData = async () => {
            !!urlParmasKey && (this.page[urlParmasKey] = this.urlParams);
            const { data } = await request.post({
                url: url,
                body: { ...this.page }
            }).catch(err => {
                window.toast(err.message);
            })
            const list = data && data[key] || []
            const newList = !!handleData ? await handleData(list) : list;
            if(!!this.state.dataList.length && newList.length >= 0 && newList.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            }
            this.page.page += 1;
            this.setState({
                dataList: [...this.state.dataList, ...newList]
            }, () => {
                if(!this.state.dataList.length){
                    this.setState({
                        isNoOne: true
                    })
                }
            })
        }
        // 下拉加载
        loadNext = async (next) => {
            const { isNoOne, isNoMore } = this.state;
            if(this.isLoading || isNoMore || isNoOne) return false;
            this.isLoading = true
            await this.initData();
            this.isLoading = false
            next && next();
        }
        componentWillUnmount() {
            this.resetData();
        }

        // 处理切换,必须是数据
        handleSwitch = (params = {}) => {
            this.resetData(() => {
                !!urlParmasKey && (this.page[urlParmasKey] = this.urlParams);
                this.page = { ...this.page, ...params };
                this.initData();
            })
        }
        // 重置数据
        resetData = (cb = () => {}) => {
            this.page = {
                page: 1,
                size: 20,
            }
            this.setState({
                dataList: [],
                isNoMore: false,
                isNoOne: false 
            }, cb)
        }
        render() {
            return <WrappedComponent
                handleSwitch={ this.handleSwitch }
                loadNext={ this.loadNext }
                { ...this.props }
                { ...this.state } />
        }
    }
    Scroll.displayName = `Scroll(${getDisplayName(WrappedComponent)})`;
    return Scroll
}

export default ScrollHoc