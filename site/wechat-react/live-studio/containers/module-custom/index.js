import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import FunctionCourseList from './components/function-course-list';

import Page from 'components/page'

import Channels from './components/channels'
import Courses from './components/courses'
import { share } from 'components/wx-utils';

import { fetchModuleInfo, modulePv } from '../../actions/live-studio'
import { liveInfo } from '../../actions/live'

class ModuleCustom extends Component {
    state = {
        channels: [],
        topics: [],
        info: null,
    }

    async componentDidMount() {
        Promise.all([this.fetchInfo(), this.getLiveInfo()]).then(result => {
            console.log(result)
            this.initShare();
          }).catch(function(reason){
            // ...
          });
        // this.fetchInfo()
        // this.getLiveInfo()
        this.props.modulePv({id:this.props.router.params.moduleId})
    }

    async fetchInfo() {
        const result = await this.props.fetchModuleInfo({
            id: this.props.router.params.moduleId,
            isShow: 'N',
        })
        if (result.state.code === 0) {
            this.setState({
                info: result.data
            })
        }
        return result;
    }

    async getLiveInfo() {
        let result = await this.props.liveInfo(this.props.location.query.liveId);
        if (result){
            this.setState({
                liveName:result.entity.name,
                liveLogo:result.entity.logo
            })
        }
        return result;
    }


    /**
     *
     * 初始化分享
     *
     * @memberof ThousandLive
     */
    initShare() {
        let wxqltitle = this.state.info.title || this.state.liveName ;
        let descript = `向您推荐${this.state.liveName}的精彩频道--${this.state.info.title},快来看看吧！`;
        let wxqlimgurl = `${this.state.liveLogo}`;
        let friendstr = wxqltitle;
        let shareUrl = window.location.href;

        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
        });
    }

    render() {
        const { info } = this.state

        return info ? (
            <Page title={info.title}>
                <div className='studio-module-custom'>
                    {
                        (info.bigModule.businessList && info.bigModule.businessList.length > 0) &&
                        <section className="list-container">
                            <header>{info && info.bigModule && info.bigModule.name || '系列课'}</header>
                            <FunctionCourseList
                                moduleInfo = {info.bigModule}
                                type="big"
                                />
                        </section>
                    }

                    {
                        (info.smallModule.businessList && info.smallModule.businessList.length > 0) &&
                        <section className="list-container">
                            <header>{info && info.smallModule && info.smallModule.name || '单次课'}</header>
                            <FunctionCourseList
                                moduleInfo = {info.smallModule}
                                type="small"
                                />
                        </section>
                    }
                    

                    <footer className='base-line'><span>这里是老师的底线</span></footer>

                </div>
            </Page>
        ) : null
    }
}

export default connect(() => ({}), { fetchModuleInfo, modulePv, liveInfo })(ModuleCustom);
