import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import CardHoc from '../../components/notice-card/card-hoc'
import { userBindKaiFang } from "../../../actions/common";
import { getUrlParams } from 'components/url-utils';

@CardHoc
@autobind
class NoticeCard extends Component {
    componentDidMount() {
        this.bindAppKaiFang(); 
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('nt-class-box');
    }

    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }
    render(){
        const { url } = this.props
        return (
            <Page title={ '录取通知书' } className="nt-class-box">
                <div className="nt-box">
                    { url && (
                        <span>
                            <img src={ url }/>
                        </span>
                    ) }
                    <p>长按图片保存，分享给好友</p>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(NoticeCard);