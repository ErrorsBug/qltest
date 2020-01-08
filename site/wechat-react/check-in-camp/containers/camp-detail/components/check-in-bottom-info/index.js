import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal, locationTo} from 'components/util';
import { autobind } from 'core-decorators';
import list from '../../../../../components/live-profit-list/list';

@autobind
export class CheckInBottomInfo extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {

        }
    }

    getEndHeadList() {
        if (this.props.isEnd === 'Y') {
            return this.props.topNList.map(item => item.headImage);
        }
        return this.props.checkInHeadList;
    }

    goRankingPage() {
        locationTo("/wechat/page/check-in-camp/check-in-ranking/" + this.props.campId)
    }


    render() {
        const headList = this.getEndHeadList();
        if (headList.length == 0) return null;
        return (
            <div className="check-in-bottom-info">
               {
                    this.props.isBegin == 'Y' ?
                    <div className="check-in-head-list">
                        <div className="left">
                            <div className="text">{this.props.isEnd === 'Y' ? '优秀学员' : '今日早到鸟'}</div>
                            <div className="head-img-list">
                                {
                                    headList.map((imgUrl,idx) => {
                                        if (idx >= 6) return null
                                        return (
                                            <span key={idx} className="head-img common-bg-img" style={{backgroundImage:`url(${imgUrl})`}}></span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="right" onClick={this.goRankingPage}>
                            <span className="achieve icon_teacher_auth"></span>
                            <span className="text">排行榜</span>
                        </div>
                    </div> :
                    <div className="user-head-list">
                        <span className="text">已报名</span>
                        <div className="head-img-list">
                            {
                                this.props.userHeadList.map((imgUrl,idx) => {
                                    if (idx >= 6) return null
                                    return (
                                        <span key={idx} className="head-img common-bg-img" style={{backgroundImage:`url(${imgUrl})`}}></span>
                                    )
                                })
                            }
                        </div>
                    </div>
               }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isBegin: getVal(state, 'campBasicInfo.dateInfo.isBegin'),
    isEnd: getVal(state, 'campBasicInfo.dateInfo.isEnd'),
    checkInHeadList: getVal(state, 'campUserList.checkInHeadList', []),
    userHeadList: getVal(state, 'campUserList.userHeadList', []),
    topNList: getVal(state, 'campUserList.topNList', []),
    campId: getVal(state, 'campBasicInfo.campId', []),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInBottomInfo)
