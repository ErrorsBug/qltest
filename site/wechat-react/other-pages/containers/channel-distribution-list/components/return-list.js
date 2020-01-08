
import React, {Component} from 'react';
import { formatMoney, imgUrlFormat, locationTo} from 'components/util'
//组件

class ReturnRepresent extends Component {
    render() {
        
        return (
            <div className="return-list-wrap">
            {
                this.props.list.map((item, index) => {
                    return (
                        <div className='represent-list-item used' key={`return_${index}`}>
                            <div className="return-flex" 
                                onClick={_ => locationTo(`/wechat/page/channel-distribution-represent-detail-list/${this.props.channelId}?userId=${item.userId}&type=return&businessType=channel`)}>
                                <div className='portrait'>
                                    <img src={item.headImage ? imgUrlFormat(item.headImage, '@132h_132w_1e_1c_2o') :'//img.qlchat.com/qlLive/liveCommon/normalLogo.png@132h_132w_1e_1c_2o'}/>
                                </div>
                                
                                <div className='right-part'>
                                    <div className='info'>
                                        <p className='represent-state'>
                                            <span className='name'>{item.userName}</span>
                                        </p>
                                        <p className='division'>返现比例{item.returnPercent}%</p>
                                        <p className='recommand-state'>推荐了<span className='recommand-num'>{item.inviteNum}</span>人过来听课</p>
                                    </div>
                                    <div className='recommand-money'>+{formatMoney(item.returnMoney, 1)}</div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        );
    }
}


export default ReturnRepresent;