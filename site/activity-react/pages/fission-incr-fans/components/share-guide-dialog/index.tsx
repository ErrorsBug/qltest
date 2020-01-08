import * as React from 'react';
import { createPortal } from 'react-dom';

import './style.scss'

interface Props {
    show: boolean
    onCloseShareDialog: () => void
}

export default class ShareGuide extends React.Component<Props, {}> {

    render() {
        return createPortal(
            <section 
                className={ `share-guide-dialog ${this.props.show ? '' : 'hide'}` }
                onClick={ this.props.onCloseShareDialog }>

                <section className='images-wrap'>
                    <img src={ require('./images/cloud-1.png') } className='cloud-1' />
                    <img src={ require('./images/cloud-2.png') } className='cloud-2' />
                    <img src={ require('./images/cloud-3.png') } className='cloud-3' />

                    <img src={ require('./images/bowl.png') } className='bowl'/>
                </section>

                <p className='share-tip'>
                    点击右上角，<br />
                    呼叫好友帮你填满保电热饭盒~
                </p>

            </section>,
            document.body
        )
    }
}