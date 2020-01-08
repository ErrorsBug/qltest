import React,{Component} from 'react';
import Page from 'components/page';
import {connect} from 'react-redux';
import dayjs from 'dayjs';

import { autobind } from 'core-decorators';

import { locationTo, getVal, imgUrlFormat } from 'components/util';
import ScrollToLoad from 'components/scrollToLoad';

import { fansDetail, funsBusiList } from '../../actions/fans-active';

@autobind
class FansExpress extends Component {

    state = {
        fansDetail: {},
        funsBusiList: [],
        noMore: false,
        page: 1,
    }

    async componentDidMount() {
        const result = await this.props.fansDetail(this.props.liveId)

        if (result.state.code == 0) {
            this.setState({
                fansDetail: result.data
            });
        }

        this.loadNext();
    }

    async loadNext(next) {
        const result = await this.props.funsBusiList(this.props.liveId, this.state.page);

        if (result.state.code == 0) {
            let noMore = false;

            if (result.data.list.length === 0) {
                noMore = true;
            }

            this.setState({
                funsBusiList: [...this.state.funsBusiList, ...result.data.list],
                noMore,
                page: this.state.page + 1
            })
        }

        next && next();
    }

    buyType(type) {

        switch (type) {
            case 'COURSE_FEE':
                return '购买了课程';
            case 'LIVEVIP':
                return '购买了直播间vip';
            case 'CHANNEL':
                return '购买了系列课';
            case 'GIFT':
                return '购买了赠礼-课程';
            case 'GIFT_CHANNEL':
                return '购买了赠礼-系列课';
        }
    }
    
    render() {
        return (
            <Page className='fans-express-container' title='千聊直通车'>
                <ScrollToLoad
                    loadNext={this.loadNext}
                    noMore={this.state.noMore} >
                    <div className="banner">
                        <img src="https://img.qlchat.com/qlLive/liveCommon/bg-fans-express.png" alt=""/>
                    </div> 
                    <div className="data-table">
                        <span className='tips'>截止到目前，千聊直通车产生的</span>
                        <dl className='data-dl'>
                            <dd>
                                <var className='value'>{ this.state.fansDetail.fansNum }</var>
                                <span className='value-title'>推荐直播间粉丝</span>
                            </dd>
                            <dd>
                                <var className='value'>{ this.state.fansDetail.businessNum }</var>
                                <span className='value-title'>交易笔数(笔)</span>
                            </dd>
                            <dd>
                                <var className='value'>{ this.state.fansDetail.amount }</var>
                                <span className='value-title'>交易金额(元)</span>
                            </dd>
                        </dl>    
                    </div>

                    <div className="express-list">
                        <span className="title">千聊直通车明细</span>
                        
                            <ul>
                            {
                                this.state.funsBusiList.map((item, index) => (
                                    <li key={`funs-item-${index}`}>
                                        <img className='head' src={imgUrlFormat(item.userHeadImg, '?x-oss-process=image/resize,w_100,limit_1')} alt="" />
                                        <div className="main">
                                            <span className="top">
                                                <var className="name">{ item.userName }</var>
                                                <var className="price">￥{ item.money }</var>
                                            </span>
                                            <span className="time">{ item.buyTime && dayjs(item.buyTime).format('MM-DD HH:mm') }</span>
                                            <span className="content">{ this.buyType(item.type) }</span>
                                            <span className="course-title">{ item.businessName && `《${item.businessName}》` }</span>
                                        </div>
                                    </li>
                                ))
                            }
                            </ul>
                        
                    </div>
                </ScrollToLoad>
            </Page>
        );
    }
}


function mapStateToProps(state) {
    return {
        liveId: getVal(state, 'fansActive.opsLiveInfo.liveId', '')
    };
}
const mapActionToProps = {
    fansDetail,
    funsBusiList,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FansExpress);