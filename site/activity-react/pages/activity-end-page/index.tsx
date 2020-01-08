import * as React from 'react';
import Page from '../../components/page';
import { render } from 'react-dom';
import './style.scss'

interface Props {
    // VideoSrc: string;
}

function ActivityEnd({}: Props) {
    return (
        <div className="activity-end">
            活动已结束
        </div>
    );
}

render(<ActivityEnd />, document.getElementById('app'));