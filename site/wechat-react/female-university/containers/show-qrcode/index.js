import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { bindAppKaiFang } from "../../actions/common";
import { getFinancialCamp } from "../../actions/experience";
import PressHoc from 'components/press-hoc'; 
import {  locationTo } from 'components/util';  

@autobind
class ShowQrcode extends Component {
    state = {
        imgUrl: '',
        title: '',
        region:''
    }
    get campId() {
        return getUrlParams("campId", "")
    }

    async componentDidMount() {
        await bindAppKaiFang()
        this.campId&&this.initCamp()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-list-box');
    }

    initCamp = async () => {
        const { financialCamp } = await getFinancialCamp({ id: this.campId })
        financialCamp?.qrcode&&locationTo(financialCamp?.qrcode)
        return 
        this.setState({
            imgUrl: financialCamp?.qrcode,
            title: '添加班主任',
            region:'show-qrcode-finance'
        })
    }
    onPress() {

    }
    render() {
        const { title, imgUrl,region } = this.state;
        return (
            <Page title={title} className="un-show-qrcode">
                <PressHoc onPress={this.onPress} className="un-group-bg" region={region||"show-qrcode"}>
                    <img src={imgUrl} className="cl-class-code-img" />
                </PressHoc>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ShowQrcode);