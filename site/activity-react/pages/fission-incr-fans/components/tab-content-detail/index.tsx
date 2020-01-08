import * as React from 'react';

import './style.scss'

interface Props {

}

export default class TabContentDetail extends React.Component<Props, {}> {
    render() {
        return (
            <div className='tab-content-detail'>
                <img src={ require('../../images/detail-01.png') }/>
                <img src={ require('../../images/detail-02.png') }/>
                <img src={ require('../../images/detail-03.png') }/>
            </div>
        )
    }
}