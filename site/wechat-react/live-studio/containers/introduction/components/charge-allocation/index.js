import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatDate} from 'components/util';
class ChargeAllocation extends Component {


    render() {
        return (
            <div className='live-studio-charge-allocation'>
                <div className="title">服务</div>    
                <ul className="charge-list">
                    {
                        this.props.chargeConfigs.map((item, idx) => {
                            return <li className={`${item.id == this.props.selectId ? "on" : ''}`} key={'cc-'+idx}
                                onClick={()=>{this.props.switchChargeId(item)}}
                            >
                                {   
                                    idx > 0 ?null 
                                    :this.props.newLiveAdmin?
                                        <span className="old-friend">新用户专享优惠</span>    
                                    :<span className="old-friend">老用户专享优惠</span> 
                                }    
                                <span className="sp-title">{item.year}</span>
                                <span className="sp-sale"><i>￥</i>{item.amount}</span>
                                <span className="sp-charge">￥{item.primeCost}</span>
                                {
                                    (idx == '0')?
                                        <span className="sp-earn">立省{item.primeCost - item.amount}</span>
                                    :null    
                                }
                                {
                                    item.id == this.props.selectId?
                                    <span className="exp">续费到 {formatDate(item.newExpirTime)}</span>
                                    :null    
                                }
                            </li>
                        })
                    }    
                   
                
                </ul>
            </div>
        );
    }
}

ChargeAllocation.propTypes = {

};

export default ChargeAllocation;