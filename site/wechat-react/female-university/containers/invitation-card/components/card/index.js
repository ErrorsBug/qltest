import React, { Component } from 'react'
import { invitationCard } from './card'
import QRCode from 'qrcode'
import { getCookie } from '../../../../../components/util';
import { getMenuNode,
        listChildren,
        getStudentInfo 
    } from '../../../../actions/home' 
 

const InvitaCard = (WrappedComponent) => {
    return class extends Component {
        state = {
            studentInfo:{},
            minCards: [],
            maxCards: [],
            isShow: false,
            len: 0
        }
        data = {
            picUrl: 'https://img.qlchat.com/qlLive/business/3VULG6GK-C1DW-QGDO-1557834922576-BZ4SGSCZS6QT.png',
            name: '华仔',
            decs: '上千聊女子大学，做五主女人。主自己，主家庭，主经济，主孩子，主男人！',
            status: '已入学',
            day: '12012天',
            qrUrl: 'https://img.qlchat.com/qlLive/business/3VULG6GK-C1DW-QGDO-1557834922576-BZ4SGSCZS6QT.png'
        }
        dataList=[]
        index = 0; 
        async componentDidMount(){
            await this.initData();
        }
        async initData(){
            const { studentInfo } =  await getStudentInfo();
            this.dataList=(await listChildren({nodeCode:"QL_NZDX_YQK"})).dataList;
            this.data.name = studentInfo.userName;
            this.data.picUrl =  studentInfo.headImgUrl;  
            this.data.day   =  this.getDay(studentInfo.createTime);  
            this.data.qrUrl = await this.getQr(studentInfo.shareType);   
            window.loading(true)
            this.initMinCards();
            this.setState({
                studentInfo:studentInfo,
                len: this.dataList.length
            })
        }
        
        // 生成二维码
        async getQr (type){ 
            let neUrl = ''
            if(type && !Object.is(type, 'LEVEL_F')){
                neUrl = `${location.origin}/wechat/page/join-university?userId=${getCookie("userId")}&couponType=share`
            } else {
                neUrl = `${location.origin}/wechat/page/join-university`
            }
            // https://ql.kxz100.com
            const res=QRCode.toDataURL(neUrl, {
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff" 
              })
                .then(url => {
                    return url
                })
                .catch(err => {
                    console.error(err)
                })     
            return res
        }
        //计算入学天数
        getDay(createTime){
            const nowTime=(new Date()).getTime()
            return Math.ceil( (nowTime-createTime)/(1000*60*60*24) ) + '天'
        }

        initMinCards(){
            this.data.decs= this.dataList[this.index].keyA
            invitationCard(this.dataList[this.index].keyB,this.data,(url)=> {
                this.initMaxCards(url);
            }, 662, 824);
        }
        initMaxCards(minUrl){
            invitationCard(this.dataList[this.index].keyC,this.data,(url)=> {
                this.setState({ 
                    maxCards: [...this.state.maxCards, url],
                    minCards: [...this.state.minCards, minUrl],
                },() => {
                    this.index += 1;
                    window.loading(false)
                    if(this.index < this.dataList.length){
                        this.initMinCards();
                    } else {
                         
                    }
                })
            }, 750, 1758, 'B');
        }
        render() {
            return <WrappedComponent { ...this.props } { ...this.state } />
        }
    }
}

export default InvitaCard;