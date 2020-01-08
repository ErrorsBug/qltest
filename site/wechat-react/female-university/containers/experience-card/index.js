import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { getQr } from "../../actions/common";
import { initConfig } from "../../actions/home";
import PressHoc from 'components/press-hoc';
import { getVal } from '../../../components/util';

@autobind
class ExperienceCard extends Component {
    state = {
        qrUrl: ''
    }
    get cardId(){
        return getUrlParams("cardId", "")
    }
    async componentDidMount() { 
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
    }
    async componentDidMount(){
        let res = await initConfig({businessType:'UFW_CONFIG_KEY'});
        let qrResult = await this.props.getQr({
            channel: 'universityGetCard',
            liveId: getVal(res, 'UFW_LIVE_ID', ''),
            pubBusinessId: this.cardId,
        });
        this.setState({
            qrUrl: (qrResult.data && qrResult.data.qrUrl) || '',
        })
    }
   
    render(){
        const { qrUrl } = this.state;
        return (
            <Page title={ '领取成功' } className="uni-exp-card">
                <div className="uni-exp-img">
                    <img className="img" src={ require('./img/bg01.png') } alt=""/>
                    <div className="uni-exp-ercode">
                        <PressHoc region="uni-family-card-press">
                            <img src={ qrUrl } alt=""/>
                        </PressHoc>
                    </div>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getQr
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCard);