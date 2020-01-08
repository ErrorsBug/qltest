import React, { Component } from 'react';
import { noticeCard } from './card'
import { formatDate } from 'components/util';
import { request } from 'common_actions/common';
import { getVal } from 'components/util';
import { getStudentInfo } from '../../actions/home'
import QRCode from 'qrcode'

const CardHoc = (WrappedComponent) => {
    return class extends Component{
        state = {
            url : ''
        }
        data = { }
        async componentDidMount(){
            await this.initUserInfo();
            this.initCardDesc();
        }
        componentWillReceiveProps(nextProps){
            if(nextProps.isShow && !!this.state.url){
                this.props.getCardUrl && this.props.getCardUrl(this.state.url)
            }
        }
        async initUserInfo() {
            const { studentInfo } = await getStudentInfo();
            await this.createQr(studentInfo);
            this.data.name = `${ studentInfo.userName } :`
            this.data.date = formatDate(studentInfo.createTime,'yyyy.MM.dd')
        }
        async createQr(studentInfo){   
            let url = "https://ql.kxz100.com/wechat/page/join-university?wcl=university_share_luqu"
            if(!!studentInfo.shareType && !Object.is(studentInfo.shareType, 'LEVEL_F')){
                url = `${url}&userId=${ studentInfo.userId }`
            }
            QRCode.toDataURL(url, {
                width: 180,
                height: 180,
                colorDark : "#000000",
                colorLight : "#ffffff" 
                })
                .then(url => {
                    this.data.qrUrl = url;
                })
                .catch(err => {
                    console.error(err)
                }
            )   
        }
        
        async initCardDesc(){
            await request({
                url: '/api/wechat/transfer/baseApi/h5/menu/node/listChildren',
                method: 'POST',
                body: {
                    nodeCode: 'QL_NZDX_DG_CARD',
                    page:{
                        size: 20,
                        page:1
                    }
                }
            }).then(res => {
                let decsList = getVal(res, 'data.dataList', []);
                let decs = [];
                decsList.forEach(element => {
                    decs.push(element.title);
                });
                this.data.decs = decs;
                this.drawingCard('https://img.qlchat.com/qlLive/business/743C979B-Y9KN-D18U-1561621048676-LPSD65UBY8HQ.png')
            }).catch(err => {
                console.log(err);
            })
        }
        drawingCard(bgUrl){
            noticeCard(bgUrl,this.data,(url)=> {
                this.props.getCardUrl && this.props.getCardUrl(url)
                this.setState({
                    url: url
                })
            },1002, 1428)
        }
        render() {
            return <WrappedComponent { ...this.props} { ...this.state } />
        } 
    }
}
export default CardHoc
