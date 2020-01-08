const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ScrollToLoad from 'components/scrollToLoad';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';

import Page from 'components/page';
import { share } from 'components/wx-utils';
import classnames from 'classnames';

// actions
import { 
    nightAnswerShowList,
    setPageNum,
    fetchShowList,
} from '../../actions/night-answer';
@autobind
class NightAnswerShow extends Component {

    state = {
        isNoMoreShow: false,
        noneData:false,//没有数据空页面的状态
    }
   

    componentDidMount() {
        this.initShowList()
    }
    async initShowList() {
        // 初始化课程列表
        if (this.props.showList.length < 1) {
            const result = await this.props.fetchShowList(
                this.props.pageNum,
                this.props.pageSize,
                true,
            );
        }

        // 初始数据不够分页，则结束分页加载更多
        if (this.props.showList.length <= 0) {
            this.setState({
                noneData: true
            });
        }
    }

    async loadMoreShow(next) {
        const result = await this.props.fetchShowList(
            this.props.pageNum + 1,
            this.props.pageSize,
            false,
        );

        next && next();

        // 是否没有更多
        if (result && result.length < this.props.pageSize) {
            this.setState({
                isNoMoreShow: true
            });
        }
    }
    render() {
        return (
            <Page title="往期节目" className="night-answer-show-container">
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={500}
                    noneOne={this.state.noneData}
                    loadNext={ this.loadMoreShow }
                    noMore={ this.state.isNoMoreShow } >
                    <div className="head"></div>
                    <div className="container">
                        <h3 className="title">千聊夜答</h3>
                        <ul className="show">
                            {
                                this.props.showList.map((item,index)=>{
                                return (
                                    <li key={`show-list-${index}`} onClick={e => locationTo('/wechat/page/night-answer?topicId='+item.id)}>
                                        <div className="btn"></div>
                                        <p className="title">{item.topic}</p>
                                        <span className="time">第{item.num}期</span>
                                    </li>
                                )
                            })
                        }
                        </ul>
                    </div>
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        showList: state.nightAnswer.nightAnswerShow,
        pageNum: state.nightAnswer.pageNum,
        pageSize: state.nightAnswer.pageSize,
    }
}

const mapActionToProps = {
    fetchShowList,
}

module.exports = connect(mapStateToProps, mapActionToProps)(NightAnswerShow);
