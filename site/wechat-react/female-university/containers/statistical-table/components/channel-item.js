import React from 'react'
import { formatDate } from 'components/util';

const ChannelItem = ({ date, orderNum }) => (
    <div className="st-channel-item">
        <p>{ date }</p>
        <p>{ orderNum }</p>
    </div>
)

export default ChannelItem