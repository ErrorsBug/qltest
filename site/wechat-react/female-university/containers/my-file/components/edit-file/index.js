
import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators'
import PortalCom from '../../../../components/portal-com';
import TextInput from './text-input'
import Picker from 'components/picker'
import CitiesHoc from 'components/cities-hoc'
import { isPc } from 'components/envi';
import { locationTo } from 'components/util'; 
import ImgUpload from '../../../../components/img-upload'
import { userUpdateInfo } from '../../../../actions/common'
import Picture from 'ql-react-picture';
import {  updateStudentInfo } from '../../../../actions/home'
import { insertOssSdk } from 'common_actions/common';

@CitiesHoc
@autobind
export default class extends Component{
    state = {
        isLoading: true,
        txtOne: this.props.bio || '',
        txtOneLen:  ( this.props.bio && this.props.bio.length || 0),
        txtTwo: this.props.hobby || '',
        txtTwoLen:  ( this.props.hobby && this.props.hobby.length || 0),
        txtTh: this.props.coolThing || '',
        txtThLen:  (this.props.coolThing && this.props.coolThing.length || 0),
        txtFore: this.props.say || '',
        txtForeLen: (this.props.say && this.props.say.length || 0),
        txtFive: this.props.remark || '',
        txtFiveLen: (this.props.remark && this.props.remark.length || 0),
        txtUserName: this.props.userName || '',
        txtUserNameLen: (this.props.userName && this.props.userName.length || 0),
        txtHeadImgUrl: this.props.headImgUrl || '',
        totalLen: 200, 
    }
    isLoading = false
    componentDidMount() {
        const { address, editHobby } = this.props;
        const newAddr = address && address.split('&');
        const value = (!!newAddr && !!newAddr[1] && JSON.parse(newAddr[1])) 
        if(!!value && !!value.length) {
            this.props.initData(value);
        } else {
            this.props.initData();
        }
        setTimeout(() => {
            if(this.nodeBox && editHobby) {
                this.nodeBox.scrollIntoView({ block: 'center' });
            }
        },250)
    }
    
    componentWillReceiveProps({ hobby, bio, coolThing, say, remark, userName, headImgUrl }) {
        if(this.props.userName != userName) {
            this.setState({
                txtOne: bio || '',
                txtOneLen:  ( bio && bio.length || 0),
                txtTwo: hobby || '',
                txtTwoLen:  ( hobby && hobby.length || 0),
                txtTh: coolThing || '',
                txtThLen:  (coolThing && coolThing.length || 0),
                txtFore: say || '',
                txtForeLen: (say && say.length || 0),
                txtFive: remark || '',
                txtFiveLen: (remark && remark.length || 0),
                txtUserName: userName || '',
                txtUserNameLen: (userName && userName.length || 0),
                txtHeadImgUrl: headImgUrl || '',
            })
        }
    }
    
    onChangeTxt(value,idx) {
        const { totalLen } = this.state;
        if(Object.is(idx, 1)){
            const curLen =  value.length;
            this.setState({
                txtOneLen: curLen,
                txtOne: value
            })
        }
        if(Object.is(idx, 2)){
            const curLen =  value.length;
            this.setState({
                txtTwoLen: curLen,
                txtTwo: value
            })
        }
        if(Object.is(idx, 3)){
            const curLen =  value.length;
            this.setState({
                txtThLen: curLen,
                txtTh: value
            })
        }
        if(Object.is(idx, 4)){
            const curLen =  value.length;
            this.setState({
                txtForeLen: curLen,
                txtFore: value
            })
        }
        if(Object.is(idx, 5)){
            const curLen =  value.length;
            this.setState({
                txtFiveLen: curLen,
                txtFive: value
            })
        }
        if(Object.is(idx, 101)){
            const curLen =  value.length;
            this.setState({
                txtUserNameLen: curLen,
                txtUserName: value
            })
        }
    }
    async submitForms(e) {
        e.preventDefault()
        e.stopPropagation()
        if(this.isLoading) return false;
        this.isLoading = true;
        try {
            window.toast("提交中...", 3000)
            const { txtOne, txtTwo, txtTh, txtFore, txtFive, txtUserName, txtHeadImgUrl } = this.state;
            const { finallyLabel, areaArr, address,userName, headImgUrl } = this.props;
            const addressArray = address && address.split('&');
            if(!finallyLabel.length && addressArray){
                addressArray[0] = addressArray[0].split(',');
            }
            if(userName!=txtUserName||headImgUrl!=txtHeadImgUrl){
                const updateNameRes=await userUpdateInfo({ 
                    headImgUrl: txtHeadImgUrl,
                    name:txtUserName, 
                })
                if(updateNameRes?.state?.code !== 0){
                    this.isLoading = false;
                    return
                } 
            }
            const updateOtherRes=await updateStudentInfo({
                address: !!finallyLabel.length ? (`${finallyLabel[0]},${ finallyLabel[1] }&${ JSON.stringify(areaArr) }` || ''): (addressArray? `${addressArray[0][0]},${ addressArray[0][1] }&${addressArray[1]}`:''),
                bio: txtOne,
                hobby: txtTwo,
                say: txtFore,
                remark: txtFive,
                coolThing: txtTh,
            })
            if(updateOtherRes?.state?.code !== 0){
                this.isLoading = false;
                return
            } 
            window.toast("保存成功", 1000)
            if(this.props.editHobby||this.props.showEdit) {
                locationTo('/wechat/page/university/community-home')
            } else {
                this.props.closeForm();
            }
            this.isLoading = false;
        } catch(err) {
            console.error(err);
            this.isLoading = false;
        }
        
       
    }
    onBlur() {
        if(!isPc()) {
            document.body.scrollIntoView();
        }
    }
    uploadHandle(imgItems) {
        
        const newFilte = imgItems.map((item) =>  {
            item.type == 'imageId' && (item.url = item.serverId)
            return item
        })
        if (!newFilte) {
            return false;
        } 
        this.setState({
            txtHeadImgUrl:newFilte[0].url,
            localId:newFilte[0].localId,
        }) 
    }
    onChangeInputAvatar = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        e.target.value = '';
    
        window.loading(true);
        insertOssSdk()
          .then(() => this.props.uploadImage(file))
          .then(_headImgUrl => {
            if (!_headImgUrl) throw Error('上传图片失败'); 
            this.setState({
                txtHeadImgUrl:_headImgUrl, 
            }) 
          })
          .catch(err => {
            window.toast(err.message);
          })
          .then(() => {
            window.loading(false);
          })
    }
    render() {
        const { closeForm, cites, areaArr, finallyLabel, confirmSelection, handleSelect, address } = this.props;
        const { txtOne, txtOneLen, txtTwo, txtTwoLen, txtTh, txtThLen, txtFore, txtForeLen, txtFive, txtFiveLen, totalLen, txtUserName, txtUserNameLen, txtHeadImgUrl,localId } = this.state;
        const newAddr = address && address.split('&');
        const valueLabel = (!!finallyLabel.length && finallyLabel && areaArr ) || (!!newAddr && !!newAddr[1] && JSON.parse(newAddr[1])) || areaArr;
        const selectValue = (!!finallyLabel.length && finallyLabel) || !!newAddr && !!newAddr[0] && newAddr[0].split(',');
        return (
            <Fragment>
                <PortalCom className='file-edit-box'>
                    <div className="file-form-group file-form-avator">
                        <h4>头像</h4> 
                        <div className="file-item-avator">  
                            <Picture src={localId||txtHeadImgUrl} resize={{w:100,h:100}}/>
                            <i className="iconfont iconxiaojiantou"></i>
                            <input
                                type="file"
                                ref={r => this.refInputAvatar = r}
                                accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                                onChange={this.onChangeInputAvatar}
                            />
                        </div>
                        
                    </div>
                    <div className="file-form-group">
                        <h4>昵称</h4>
                        <TextInput
                            className="file-form-nickname"
                            value={ txtUserName }
                            curLen={ txtUserNameLen }
                            totalLen={ 14 }
                            idx={ 101 }
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="请输入昵称"/>
                    </div>
                    <div className="file-form-group">
                        <h4>地区</h4>
                        <div className="file-form-input">
                            <Picker
                                col={2}
                                data={ cites }
                                value={ valueLabel }
                                barClassName='picker-bar'   
                                title="选择地区"
                                onChange={ confirmSelection }
                                onPickerChange={ handleSelect }>
                                <div className={ `text ${ !selectValue.length ? 'no-select' : ''}` }>
                                    { !!selectValue.length ? `${selectValue[0]}，${ selectValue[1] }` :  '请选择你所在的地区' }
                                </div>
                            </Picker>
                        </div>
                    </div>
                    <div className="file-form-group">
                        <h4>职业</h4>
                        <TextInput
                            value={ txtOne }
                            curLen={ txtOneLen }
                            totalLen={ totalLen }
                            idx={ 1 }
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="说说你的职业"/>
                    </div>
                    <div className="file-form-group" ref={ (r) => this.nodeBox = r }>
                        <h4>擅长</h4>
                        <TextInput
                            ref={ (r) => this.inputNode = r }
                            value={ txtTwo }
                            curLen={ txtTwoLen }
                            totalLen={ totalLen }
                            idx={ 2 }
                            autoFocus
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="这么多丰功伟绩不写一下吗~"/>
                    </div>
                    <div className="file-form-group">
                        <h4>做过最酷的事</h4>
                        <TextInput
                            value={ txtTh }
                            curLen={ txtThLen }
                            totalLen={ totalLen }
                            idx={ 3 }
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="跟同学们聊聊你做过的最酷的事"/>
                    </div>
                    <div className="file-form-group">
                        <h4>可以帮助大家的地方</h4>
                        <TextInput
                            value={ txtFore }
                            curLen={ txtForeLen }
                            totalLen={ totalLen }
                            idx={ 4 }
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="说说你能为同学们提供哪些帮助或资源"/>
                    </div>
                    <div className="file-form-group last-child">
                        <h4>其他</h4>
                        <TextInput
                            value={ txtFive }
                            curLen={ txtFiveLen }
                            totalLen={ totalLen }
                            idx={ 5 }
                            onBlur={ this.onBlur }
                            onChangeTxt={ this.onChangeTxt }
                            placeholder="有什么想和一起学习的小伙伴说吗"/>
                    </div>
                </PortalCom>

                <PortalCom className='file-close'>
                    <p onClick={ closeForm }></p>
                </PortalCom>
                
                <PortalCom className='file-finish'>
                    <div className={ `edit-form-btn on-visible on-log ${!!txtUserNameLen || !!selectValue.length || !!txtOne.length || !!txtTwo.length || !!txtTh.length || !!txtFore.length || !!txtFive.length ? 'red' : '' }` } 
                        data-log-name='自定义'
                        data-log-region="un-flag-show-diy"
                        data-log-pos="0"
                    onClick={ this.submitForms }>完成</div>
                </PortalCom>
            </Fragment>
            
        )
    }
}