import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { getVal } from 'components/util';
import ConsultItem from '../consult-dialog/consult-item';

import { consultList } from '../../../../../actions/topic-intro';

@autobind
class ConsultModule extends Component {

    componentDidMount() {
        this.fetchConsultList();
    }

    async fetchConsultList(next) {
        await this.props.loadConsultList({
            topicId: this.props.topicId,
            page: this.props.consultPage,
        });

        if (next) {
            next();
        }
    }

    onClickMore = () => {
        this.fetchConsultList();
    }

    render() {
        if (this.props.consultList.length > 0) {
            return (
                <div className="p-intro-section topic-consult-module-v2" ref={this.props.consultRef}>
                    <div className="p-intro-section-title">
                        <p>精选留言
                            {/* <span className='consult-count'>{ this.props.consultNum }</span> */}
                        </p>
                    </div>
                    {
                        this.props.consultList.map((item, index) => {
                            return <ConsultItem key={index}
                                {...item}
                                consultPraise = {this.props.consultPraise}
                            />
                        })
                    }
                    {
                        this.props.consultStatus === 'end' ? 
                            <div className="btn-more-consult">没有更多留言了</div> :
                            this.props.consultStatus === 'pending' ?
                                <div className="btn-more-consult">加载中</div> :
                                <div className="btn-more-consult on-log"
                                    data-log-name="留言-查看更多"
                                    data-log-region="consult-list-more"
                                    onClick={this.onClickMore}>查看更多</div>
                    }
                </div>
            );
            
        } else {
            return null;
        }
    }
}

function mapStateToProps (state) {
    return {
        topicId: getVal(state, 'topicIntro.topicId', ''),

        consultNum: getVal(state, 'topicIntro.consultNum', 0),
        consultList: getVal(state, 'topicIntro.consultList', []),
        consultPage: getVal(state, 'topicIntro.consultPage', 1),
        consultNoMore: getVal(state, 'topicIntro.consultNoMore', false),
        consultStatus: getVal(state, 'topicIntro.consultStatus'),
    }
}
const mapActionToProps = {
    loadConsultList: consultList,
}

export default connect(mapStateToProps, mapActionToProps)(ConsultModule);