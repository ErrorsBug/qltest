import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import GroupCard from '../../components/group-card'
import { getUrlParams } from 'components/url-utils';
import { userBindKaiFang } from "../../../actions/common"

@autobind
class ClassCode extends Component {
    get classId(){
        return getUrlParams('classId', '')
    }
    get nodeCode(){
        return getUrlParams('nodeCode', '')
    }
    
    async componentDidMount() { 
        this.bindAppKaiFang();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
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
        return (
            <Page title={ '千聊女子大学' } className="un-class-code">
                <div className="un-class-bg">
                    <GroupCard classId={ this.classId } />
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

module.exports = connect(mapStateToProps, mapActionToProps)(ClassCode);