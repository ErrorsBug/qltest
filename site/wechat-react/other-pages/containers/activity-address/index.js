import React,{Component} from 'react';
import Page from 'components/page';
import {connect} from 'react-redux';

import { locationTo, dangerHtml } from 'components/util';
import { fillParams } from 'components/url-utils';

import { getSimpleTopic } from 'actions/topic';
import { getSimpleChannel } from 'actions/channel';
import AddressSelect from 'components/address-select';
import { Confirm } from 'components/dialog';

import { giftValidate, giftCourseList, choseGift, giftAvailable, configsByCode, saveAddress } from '../../actions/activity-common'



function mapStateToProps(state) {
    return {
        addressInfo: state.activity.addressInfo,
        addressPermission: state.activity.addressPermission,
        addressFontObject: state.activity.addressFontObject,
    };
}
const mapDispatchToProps = {
    saveAddress,
};

class ActivityAddress extends Component {
    constructor(props){
        super(props);
        this.activityCode = props.location.query.activityCode;
    }

    state = {
        areaAdress: '点击选择收货地址区域',

        name: '',
        phone: '',
        address: '',

        bottomFont: '',
    }

    isSubmiting = false

    componentDidMount() {
        
        this.initInfo()
    }

    initInfo = () => {
        var bottomFont = this.props.addressFontObject.bottomFont || ''
        bottomFont = (bottomFont || '').replace(/\&lt;/g, (m) => "<")
        bottomFont = (bottomFont || '').replace(/\&gt;/g, (m) => ">")
        this.setState({
            bottomFont: bottomFont
        })

        const addressInfo = this.props.addressInfo
        let areaAdress = "点击选择收货地址区域"
        let address = ""



        const reg1 = /.+?---/m
        let result1;
        if ((result1 = reg1.exec(addressInfo.address)) != null) {
            areaAdress = result1[0].replace("---", "")
        }
        const reg2 = /---.+/m
        let result2;
        if ((result2 = reg2.exec(addressInfo.address)) != null) {
            address = result2[0].replace("---", "")
        }
        this.setState({
            name: addressInfo.name,
            phone: addressInfo.phone,
            areaAdress: areaAdress,
            address: address,
        })
    }

    getareaLabel(selectAdress){
		this.setState({
			areaAdress:selectAdress.join(""),
		});
    }
    
    nameInputHandle = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    phoneInputHandle = (e) => {
        this.setState({
            phone: e.target.value
        })
    }
    addressInputHandle = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    btnCommitHandle = async () => {
        if (this.isSubmiting) {
            return false;
        }

        if (!this.state.name) {
            window.toast('请输入姓名', 1000);
            return;
        }

        if (!this.state.phone) {
            window.toast('请输入手机号', 1000);
            return;
        }

        if (!this.state.areaAdress) {
            window.toast('请选择收货地区', 1000);
            return;
        }

        if (!this.state.address) {
            window.toast('请输入详细地址', 1000);
            return;
        }

        if (this.state.name.length > 50) {
            window.toast('姓名长度不能超过50', 1000);
            return;
        }

        if (!/^1[0-9]{10}$/.test(this.state.phone)) {
            window.toast('请输入11位手机号码', 1000);
            return;
        }

        if (this.state.address.length > 200) {
            window.toast('收货地址长度不能超过200', 1000);
            return;
        }

        this.isSubmiting = true;


        var regRN = /\n/g;
        let addressText = this.state.areaAdress + "---" + this.state.address.replace(regRN, "")



        const result = await this.props.saveAddress({
            activityCode: this.activityCode,
            name: this.state.name,
            phone: this.state.phone,
            address: addressText
        })

        if(result && result.state) {
            if(result.state.code === 0) {
                window.toast('提交成功', 1000)
                setTimeout(function() {
                    history.back()
                }, 2000);
            } else {
                window.toast(result.state.msg || '保存失败，请稍后重试', 1000)
            }

        } else {
            window.toast('保存失败，请稍后再试', 1000)
        }

        this.isSubmiting = false;
    }

    render() {
        if(this.props.addressPermission === "Y") {
            return (
                <Page title="填写收货地址" className='activity-address-page'>

                    <div className="info">{this.props.addressFontObject.topFont}</div>

                    <div className="item-con">
                        <div className="title">姓名</div>
                        <div className="input-wrap"><input id="name" type="text" value={this.state.name} onChange={this.nameInputHandle} /></div>
                    </div>
                    <div className="item-con">
                        <div className="title">手机号码</div>
                        <div className="input-wrap"><input id="name" type="text" value={this.state.phone} onChange={this.phoneInputHandle} /></div>
                    </div>
                    <div className="item-con">
                        <div className="title">所在地区</div>
                        <AddressSelect showText={this.state.areaAdress} col={3} getAreaLabel={this.getareaLabel.bind(this)} />
                    </div>
                    
                    <div className="item-con">
                        <div className="title">具体地址</div>
                        <div className="textarea-wrap"><textarea id="address" value={this.state.address} onChange={this.addressInputHandle}  name="" id="" cols="30" rows="3" placeholder="请填写具体地址" ></textarea></div>
                    </div>

                    <div className="btn-commit" onClick={this.btnCommitHandle}>提交</div>

                    <div className="des">
                        <div className="bottom-info">注意事项</div>
                        <div className="bottom-info" dangerouslySetInnerHTML={dangerHtml(this.state.bottomFont)}></div>
                    </div>

                </Page>
            )
        } else {
            return (    
                <Page title="填写收货地址" className='activity-address-full-page'>
                    <div className="full"></div>
                    <div className="des">{this.props.addressFontObject.blankFont}</div>
                </Page>
            )
        }
    }
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(ActivityAddress);