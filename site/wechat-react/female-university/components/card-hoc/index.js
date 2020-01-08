import React, { Component } from 'react'
import { studentCardMake } from './card'
import { getStudentInfo, updateStudentInfo } from '../../actions/home'
import { getUrlParams } from 'components/url-utils';


const CardHoc = (width = 670, height = 421) =>  (WrappedComponent) => {
    return class extends Component{
        state = {
            url: '',
            userInfo: {},
        }
        isSubmit = false;
        data = {  };
        get studentId() {
            return getUrlParams('studentId', '')
        }
        componentDidMount() {
            this.initData();
        }
        // 初始化数据
        async initData() {
            const params = {}
            if(!!this.studentId){
                params.studentId = this.studentId
            }
            const { studentInfo } = await getStudentInfo(params);
            if( !!studentInfo){
                this.data = {
                    name: studentInfo.userName || '',
                    picUrl: studentInfo.headImgUrl,
                    class: `${studentInfo.year}级学生`,
                    studentId: `学号：${ studentInfo.studentNo }`
                }
                this.setState({
                    userInfo: studentInfo
                }, () => {
                    this.initCard();
                })
            }
        }
        // 初始化画卡
        initCard(){
            this.drawingCard('https://img.qlchat.com/qlLive/business/X3Q1OOEB-ZKJ8-44VG-1561700515989-AQ7A17LHO6Q4.png')
        }
        drawingCard(bgUrl){
            studentCardMake(bgUrl,this.data,(url)=> {
                // sessionStorage.setItem(this.studentId || this.state.userInfo.userId, url)
                this.setState({
                    url: url
                })
            },width, height)
        }
        updateUserInfo = async (params) => {
            if(this.isSubmit) return false;
            this.isSubmit = true;
            await updateStudentInfo(params);
            this.initData();
            this.isSubmit = false;
        }
        render() {
            return <WrappedComponent 
                updateUserInfo={ this.updateUserInfo }
                { ...this.props } 
                { ...this.state } />
        }
    }
}

export default CardHoc