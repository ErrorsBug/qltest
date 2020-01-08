import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page'; 
import PressHoc from 'components/press-hoc';
import { getClassInfo, getStudentInfo } from '../../actions/home';
import { getUrlParams } from 'components/url-utils';
import { getMenuNode } from '../../actions/home';

@autobind
class ClassInfoCode extends Component { 
    state = { 
        classInfo: {},
        bgUrl: ''
    }
    get nodeCode(){
        return getUrlParams('nodeCode', '')
    }
    async componentDidMount() {
        if(this.nodeCode) {
            this.initData();
        }
        const { studentInfo } = await getStudentInfo()
        const { classInfo } = await getClassInfo({ classId: studentInfo.classId, ...this.page });
        this.setState({ 
            classInfo: classInfo || {}
        })
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('cl-class-code-box');
    }
    // 获取节点背景图片
    async initData() {
        const { menuNode } = await getMenuNode({ nodeCode: this.nodeCode })
        this.setState({
            bgUrl: menuNode?.keyA || ''
        })
    }
    render(){
        const { classInfo, bgUrl } = this.state
        return (
            <Page title={ `千聊女子大学` } className="cl-class-code-box">
                { this.nodeCode ? (
                    <div className="cl-class-img">
                        <img src={ bgUrl } alt=""/>
                        <div className="cl-class-er">
                            <img src={ classInfo.qrCodeNew } alt=""/>
                        </div>
                    </div>
                ) : (
                    <PressHoc onPress={ this.onPress } className="un-group-bg" region="un-class-info-code">
                        <img src={ classInfo.qrCode } className="cl-class-code-img" />
                    </PressHoc> 
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
 
};

module.exports = connect(mapStateToProps, mapActionToProps)(ClassInfoCode);