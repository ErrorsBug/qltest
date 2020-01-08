import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind, debounce, throttle } from 'core-decorators';
import Page from 'components/page';
import GroupListItem from './component/group-list-item';
import GroupConfirmBox from './component/group-confirm-box';
import { isNumberValid } from 'components/util';
import Actionsheet from 'components/dialog/bottom-dialog';
import {
    openGroup,
} from '../../actions/channel-group-list';

import { saveChannelAutoDistributionSet,channelAutoDistributionInfo } from '../../actions/channel-distribution';

@autobind
class ChannelGroupList extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        showComfirmBox: false,
        curChannelId: '',
        curDiscountStatus: '',
        curOriginPrice: '',
        curAutoShare:'',
        curAutoPercent:'',
    }

    async showBox(channelId, discountStatus, originPrice) {
        let result = await this.props.channelAutoDistributionInfo(channelId);
        let autoShareInfo=result.data;
        if(result.state.code===0){
            this.setState({
                showComfirmBox: true,
                curChannelId: channelId,
                curDiscountStatus: discountStatus,
                curOriginPrice: originPrice,
                curAutoPercent: autoShareInfo.autoSharePercent,
                curAutoShare: autoShareInfo.isOpenShare,
            });
        }
        
    }

    hideBox() {
        this.setState({
            showComfirmBox: false,
        })
    }

    handleNewChannelBtnTouch() {
        window.location.href = `/wechat/page/channel-create?liveId=${this.props.liveId}`;
    }

    handleTipsBtnTouch() {
        window.location.href = 'https://mp.weixin.qq.com/s/m92orMBHLCH6dBG2ljdkSg';
    }

    changeAutoShareStatus(){
        this.setState({            
            curAutoShare: this.state.curAutoShare==="Y"?"N":"Y",
        });
    }
    changeAutoPercent(e){
        this.setState({            
            curAutoPercent: e.currentTarget.value,
        });
        
    }

    async saveSetGroupOpen(data = {}){
        // let { channelId, discount, groupNum, discountType, simulationStatus, groupHour } = data
        this.props.openGroup(data);
        this.props.saveChannelAutoDistributionSet(
            this.state.curAutoShare,
            this.state.curAutoPercent,
            data.channelId
        );
    }
    componentDidMount() {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    render() {
        const showOpenedList = this.props.openedGroups.length > 0;
        const showUnopenedList = this.props.unopenedGroups.length > 0; 
        const showEmpty = !showOpenedList && !showUnopenedList;
        return (
            <Page  title={'拼课'}  className="channel-group-list">
                <Actionsheet
                    show={this.state.showComfirmBox}
                    theme='empty'
                    className='filter-container'
                    onClose={this.hideBox}
                >
                    <GroupConfirmBox
                        showComfirmBox={ this.state.showComfirmBox }
                        curChannelId={ this.state.curChannelId }
                        curDiscountStatus={ this.state.curDiscountStatus }
                        curOriginPrice={ this.state.curOriginPrice }
                        openGroup={ this.saveSetGroupOpen }
                        hideBox={ this.hideBox }
                        curAutoShare={this.state.curAutoShare}
                        curAutoPercent={ this.state.curAutoPercent}
                        changeAutoShareStatus={ this.changeAutoShareStatus}
                        changeAutoPercent={ this.changeAutoPercent}
                    />
                </Actionsheet>
               
                <div className="scroll-box">
                    <div className={showEmpty ? 'display-empty-box' : 'hide-empty-box'}>
                        <img src={ require('components/empty-page/img/ico_norecord8.png') } />
                        <span>您还没有相关内容哦</span>
                        <div className="bg"></div>
                    </div>
	                {
		                showUnopenedList &&
                        <div className="group-list on-log on-visible" 
                            data-log-name="拼课设置访问数"
                            data-log-region="ping-setting"
                            data-log-pos="group-list">
                            <header>
                                <span>未开启</span>
                            </header>
                            <section>
				                {
					                this.props.unopenedGroups.map((item) =>
                                        <GroupListItem
                                            key={item.id}
                                            channelId={item.id}
                                            headImage={item.headImage}
                                            name={item.name}
                                            subscrNum={item.authNum}
                                            discountStatus={item.discountStatus}
                                            originPrice={item.amount}
                                            discountPrice={item.discount}
                                            groupNum={item.groupNum}
                                            showBox={this.showBox}
                                        />
					                )
				                }
                            </section>
                        </div>
	                }
	                {
		                showOpenedList &&
                        <div className="group-list">
                            <header>
                                <span>已开启</span>
                            </header>
                            <section>
				                {
					                this.props.openedGroups.map((item) =>
                                        <GroupListItem
                                            key={item.id}
                                            channelId={item.id}
                                            headImage={item.headImage}
                                            name={item.name}
                                            subscrNum={item.authNum}
                                            discountStatus={item.discountStatus}
                                            originPrice={item.amount}
                                            discountPrice={item.discount}
                                            groupNum={item.groupNum}
                                            showBox={this.showBox}
                                        />
					                )
				                }
                            </section>
                        </div>

	                }
                    <div className="add-new-class-btn" onClick={this.handleNewChannelBtnTouch}>
                        <span>新建系列课，立即开启拼课</span>
                    </div>
                    <span className="show-tips-btn" onClick={this.handleTipsBtnTouch}>查看拼课须知</span>
                </div>
            </Page>
        );
    }
}




const mapStateToProps = (state, ownProps) => {
    return {
        liveId: state.channelGroupList.liveId,
        unopenedGroups: state.channelGroupList.unopenedGroups,
        openedGroups: state.channelGroupList.openedGroups,
    }
}

const mapActionToProps = {
   openGroup,
   saveChannelAutoDistributionSet,
   channelAutoDistributionInfo,
}

ChannelGroupList.propTypes = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelGroupList);
