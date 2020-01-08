import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

@autobind
export default class extends PureComponent {
    render() {
        const { className='', isShowCate, keyA, keyB, keyC, keyD, keyE, resize={ w: 220, h: 228}, id } = this.props;
        return (
            <div className={ `tutor-item-box ${ className }` }>
                <div className="tr-item-pic">
                    <div>
                        <Picture src={ keyD || 'https://img.qlchat.com/qlLive/business/H1D39EOM-X1J5-D55H-1560499366683-6HOJMIUXELV7.png' } resize={resize} placeholder={ true }  />
                    </div>
                </div>
                <div className="tr-item-info">
                    <div>
                        <span className={ `name ${ Object.is(keyC, 'Y') ? "nameRight" : "" }` }>{ keyA } | { keyB } { Object.is(keyC, 'Y') && <var>院长</var> }</span>
                        <span className="info">{ keyE }</span>
                    </div>
                </div>
            </div>
        )
    }
}