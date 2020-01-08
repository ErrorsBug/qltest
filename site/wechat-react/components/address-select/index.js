import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import { locationTo } from '../util';
import Picker from '../picker';
import { getQr,regionSelect } from '../../coral/actions/common';


class AddressSelect extends Component {
    state = {
        areaValue: ['','',''],
        areaLabel: ['','',''],
        areaArray: [],
    }
    componentDidMount() {
        this.getRegionProvince();

    }

    /**
     * 
     * 初始化城市数据
     * @memberof CustomerCollect
     */
    async getRegionProvince() {
        let provinceResult = await this.props.regionSelect({ pid: '' });
        if (provinceResult.state && provinceResult.state.code == 0) {
            let areaArray = provinceResult.data.regions.map(item => {
                //col是列数，数组的层数比列数小的话，目前选择的时候结果数组还是拿数组层数的。所以使用这个Picker组件时要注意col和数据层数要保持一致
                let countyArrayInit=[{
                    label: '', 
                    value: '0',
                }];
                return {
                    label: item.fullName,
                    value: String(item.id),
                    children:[
                        {
                            label: '', 
                            value: '0',
                            children:countyArrayInit,
                        }
                    ]
                }
            })
            this.setState({
                areaArray,
            }, async () => {
                let city = await this.getRegionCity(this.state.areaArray[0].value,this.state.areaArray);
                let areaValue = [String(areaArray[0].value), String(city.data.regions[0].id)];
                if(this.props.col==3){//三级地址联动，区级
                    areaValue.push("0");
                }
                if (city.data) {
                    this.setState({
                        areaValue: areaValue,//只有初始化和确定时才赋值
                    })
                }
            })


        }

    }

    /**
     * 获取市级列表
     * 
     * @param {any} id 
     * @returns 
     * @memberof CustomerCollect
     */
    async getRegionCity(id,thisProvinceData) {
        let cityResult = await this.props.regionSelect({ pid: id });

        if (cityResult.state && cityResult.state.code == 0) {
            let cityArray = cityResult.data.regions.map(item => {
                return {
                    label: item.fullName,
                    value: String(item.id),
                    children:[{
                        label: '', 
                        value: '0',
                    }]
                }
            })

            let areaArray = this.state.areaArray.map((item) => {
                if (id == item.value) {
                    return {
                        ...item,
                        children:cityArray||[...item.children,...cityArray]
                    }
                } else {
                    return item
                }
            })

            if(this.props.col==3){//三级地址联动，区级
                this.getRegionCounty(thisProvinceData[0].value,areaArray[0].children[0].value,areaArray);
            }else{
                this.setState({
                    areaArray:[...areaArray]
                })
            }
            // this.setState({
            //     areaArray:[...areaArray]
            // }, async () => {
            //     if(this.props.col==3){//三级地址联动，区级
            //         this.getRegionCounty(thisProvinceData[0].value,this.state.areaArray[0].children[0].value);
            //     }
            // })
        }
        return cityResult;
    }
    /**
     * 获取区级列表
     * 
     * @param {any} id 
     * @returns 
     * @memberof CustomerCollect
     */
    async getRegionCounty(fId,id,areaArraya){
        let countyResult = await this.props.regionSelect({ pid: id });
        
        if (countyResult.state && countyResult.state.code == 0) {
            let countyArray = countyResult.data.regions.map(item => {
                return {
                    label: item.fullName,
                    value: String(item.id),
                }
            })
            let ccArray = areaArraya.filter(item => item.value == fId)[0].children.map((item) => {
                if (id == item.value) {

                    return {
                        ...item,
                        children:countyArray||[...item.children,...countyArray]
                    }
                    
                } else {
                    return item
                }
            })
            let areaArray = areaArraya.map((item) => {
                if (fId == item.value) {

                    return {
                        ...item,
                        children:ccArray||[...item.children,...ccArray]
                    }
                    
                } else {
                    return item
                }
            })


            this.setState({
                areaArray:[...areaArray]
            },function(){
                console.log(this.state.areaArray);
            })
        }
        return countyResult;
    }


    /**
     * 确定选择城市
     * 
     * @param {any} newValue 
     * @memberof CustomerCollect
     */
    addressHandleChange(newValue) {
        let provinceId = newValue[0];
        let provinceData = this.state.areaArray.filter(item => item.value == provinceId);
        let cityId = newValue[1];
        let cityData = provinceData[0].children.filter(item => item.value == cityId);
        let countyId = newValue[2];
        let countyData = cityData[0].children.filter(item => item.value == countyId);
        
        this.setState({
            areaValue: newValue,
            areaLabel: [provinceData[0].label, cityData[0].label ||'', countyData[0].label ||'']
        },function(){
            this.props.getAreaLabel(this.state.areaLabel);
        });
    }
    /**
     * 选择城市时更新数据
     * 
     * @param {any} newValue 
     * @memberof CustomerCollect
     */
    async addressHandlePickerChange(newValue) {
        console.log("选择城市时更新数据");
        console.log(newValue);
        let provinceId = newValue[0];
        let provinceData = this.state.areaArray.filter(item => item.value == provinceId);
        console.log(provinceData);
        
        let cityId =  newValue[1];
        let cityData = provinceData[0].children.filter(item => item.value == cityId);

        if (this.props.col>=2&&!provinceData[0].children || provinceData[0].children[0].value =='0' ) {//选择省级时，判断该省级下面的市级信息是否已经加载过了。
            this.getRegionCity(provinceId,provinceData);
        }else if(this.props.col>=3&&(!cityData[0].children || cityData[0].children[0].value =='0')){//选择市级时，判断该市级下面的区级信息是否已经加载过了。
            this.getRegionCounty(provinceId,cityId,this.state.areaArray);
        }
        
        
    }  

    /**
     * 更新填写数据
     * 
     * @param {any} index 
     * @param {any} content 
     * @memberof CustomerCollect
     */
    changeData(index,content) {
        let fields = this.state.fields;
        fields[index].content = content;
        this.setState({
            fields
        })
    }

    // areaArray = {this.state.areaArray}
    // areaValue = {this.state.areaValue}
    // areaLabel = {this.state.areaLabel}
    // changeData={this.changeData}
    // addressHandleChange={this.addressHandleChange}
    // addressHandlePickerChange={this.addressHandlePickerChange}
    render() {
        return (
            <div className="address-selector">
                <Picker
                    col={this.props.col}
                    data={this.state.areaArray}
                    value={this.state.areaValue}
                    title="选择地区"
                    onChange={this.addressHandleChange.bind(this)}
                    onPickerChange={this.addressHandlePickerChange.bind(this)}
                >
                    <div className='text'>
                        {
                            this.props.showText ? 
                                    this.props.showText
                                :
                                    this.state.areaLabel[0]?
                                    `${this.state.areaLabel[0]}  ${this.state.areaLabel[1]}  ${this.state.areaLabel[2]}`
                                    :
                                    "请选择所在地区"
                        }
                        <i className="icon_enter"></i>
                    </div>
                </Picker>
            </div>
        );
    }
}
AddressSelect.propTypes={
    // col: PropTypes.number.isRequired,
    // getAreaLabel: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
    return {
    }
}
const mapActionToProps = {
    regionSelect,
}

module.exports = connect(mapStateToProps, mapActionToProps)(AddressSelect);
