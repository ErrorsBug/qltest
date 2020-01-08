
import React, { Component } from 'react'
import { api } from 'actions/common.js'

const CitiesHoc = (WrappedComponent) => {
    return class extends Component{
        state = {
            cites: [],
            areaArr: [],
            areaLabel: [],
            finallyLabel:[],
        }
        initData = async (params) => {
            let cites = sessionStorage.getItem('cites');
            if(!cites){
                cites = await this.getCityData();
            } else {
                cites = JSON.parse(cites);
            }
            await this.getCityArr(cites, params || [ cites[0].value, '' ]);
        }
        // 获取城市数据
        getCityArr = async(cites,ids) => {
            const areaArr = await this.getCityData({ pid:ids[0] });
            const idx = cites.findIndex((item, index) => Object.is(item.value, ids[0]));
            const value = ids[1] || areaArr[0].value;
            const selectObj = areaArr.filter((item) => Object.is(item.value, value));
            cites[idx].children = areaArr;
            sessionStorage.setItem('cites', JSON.stringify(cites));
            this.setState({
                cites: cites,
                areaArr: [ cites[idx].value, value ],
                areaLabel: [ cites[idx].label, selectObj[0].label || '' ]
            })
        }
        // 获取省数据
        getCityData = async (params = { pid: ''}) => {
            const { data } = await api({
                method: 'POST',
                body: params,
                url: '/api/wechat/studio/region-select',
            })
            const arr = (data && data.regions) || [];
            return arr.map((item, index) => {
                return {
                    label: item.name,
                    value: String(item.id),
                }
            })
        }
        // 处理滑动选择
        handleSelect = async (ids) => {
            const { cites } = this.state;
            const idx = cites.findIndex((item) => Object.is(item.value, ids[0]))
            const children = cites[idx].children;
            if(!!children){
                const value = ids[1] || children[0].value;
                const selectObj = children.filter((item) => Object.is(item.value, value))
                this.setState({
                    areaArr: [ cites[idx].value, value ],
                    areaLabel: [ cites[idx].label, selectObj[0].label || '' ]
                })
            } else {
                await this.getCityArr(cites, ids)
            }
        }
        // 确认
        confirmSelection = () => {
            this.setState({
                finallyLabel: this.state.areaLabel
            })
        }
        render() {
            return <WrappedComponent 
                        { ...this.props } 
                        { ...this.state } 
                        initData={ this.initData }
                        handleSelect={ this.handleSelect }
                        confirmSelection={ this.confirmSelection } />
        }
    }
}

export default CitiesHoc