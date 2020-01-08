const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import dayjs from 'dayjs';

class ChannelDistributionIndexListItem extends Component {
    render() {
        return (
            <a className='channel-distri-index-list-item' href={`/wechat/page/channel-distribution-list/${this.props.id}`} key={`channel-d-item-${this.props.index}`}>
                <div className='distri-info'>
                    <div className='channel-title'>
                        {this.props.name}
                    </div>
                    <div className='channel-time'>{dayjs(this.props.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
                <div className='arrow-go icon_enter'>
                    <Link to={'/wechat/page/channel-distribution-list/'+this.props.id}></Link>
                </div>
            </a>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {

}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionIndexListItem);
export default connect(mapStateToProps, mapActionToProps)(ChannelDistributionIndexListItem);