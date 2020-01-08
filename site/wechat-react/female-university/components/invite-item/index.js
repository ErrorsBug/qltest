import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import { formatDate, formatMoney } from 'components/util';

@autobind
export default class extends PureComponent {
    render() {
        const { className='', createByName,createByHeadImg,createTime,money, resize={ w: 220, h: 228} } = this.props;
        return (
            <div className={ `invite-item-box ${ className }` }>
                <div className="tr-item-pic">
                    <div>
                        <Picture src={  createByHeadImg || 'https://img.qlchat.com/qlLive/business/H1D39EOM-X1J5-D55H-1560499366683-6HOJMIUXELV7.png' } resize={resize} placeholder={ true }  />
                    </div>
                </div>
                <div className="tr-item-info">
                    <div>
                        <span className="name">{createByName} </span>
                        <span className="info">{formatDate(createTime, 'yyyy-MM-dd hh:mm:ss')}</span>
                    </div>
                </div>
                <div className="ivi-money">+{formatMoney(money||0)}元</div>
            </div>
        )
    }
}