import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import Header from './components/header';
import PortalCom from '../../components/portal-com';
import GroupCountdown from '../../components/groud-countdown'
import GroupButton from '../../components/group-button'
import ImageText from '../../components/image-text'

@autobind
class GroupDistributionOther extends Component {
    state = {
        isLoading: false
    }
    async componentDidMount() { 
        this.setState({
            isLoading: true
        })
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
    }
    
    render(){
        const { isLoading } = this.state;
        return (
            <Page title="拼团" className="uni-gd-box">
                <section className="scroll-content-container">
                    <Header />
                    <ImageText />
                </section>
                <PortalCom className="gd-btns-share">
                    <GroupCountdown className="gd-btns-count" />
                    <GroupButton>邀请好友</GroupButton>
                </PortalCom>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    
};

module.exports = connect(mapStateToProps, mapActionToProps)(GroupDistributionOther);