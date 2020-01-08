import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// utils 
import { getVal, imgUrlFormat, locationTo } from 'components/util';

import { fetchShareList } from '../../../../../actions/topic-intro';

class ShareRank extends Component {

    componentDidMount() {
        this.props.fetchShareList({ topicId: this.props.topicId })
    }

    render() {
        return (
            <section className='share-rank-container icon_enter'
                onClick={() => locationTo(
                    this.props.topicInfo.type === 'charge' ?
                        `/wechat/page/distribution/promo-rank?businessId=${this.props.topicId}&businessType=topic`
                        :    
                        `/topic/share/shareuser/${this.props.topicId}.htm`
                )}
            >
                <span className='share-rank-label'>分享达人榜</span>

                {
                    this.props.shareList.length > 0 ?
                        <div className='share-list'>
                            {
                                this.props.shareList.map((item, index) => (
                                    <img key={`share-user-${index}`} src={ imgUrlFormat(item.userHeadImg) } />
                                ))
                            }
                        </div>
                        :
                        <span className='share-rank-tip'>快来第一个分享吧</span>
                }
            </section>
        );
    }
}

ShareRank.propTypes = {

};

function mapStateToProps (state) {
    return {
        topicId: getVal(state, 'topicIntro.topicId', ''),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        shareList: getVal(state, 'topicIntro.shareList', []).slice(0, 4),
    }
}

const mapActionToProps = {
    fetchShareList,
}

export default connect(mapStateToProps, mapActionToProps)(ShareRank);
