import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TypeItem extends Component {
    render() {
        return (
            <div className="type-item-list">
                <div className={`type-item${this.props.currentId==''?' current':''}`}  
                    data-log-region="coupon-whole"
                    data-log-pos="0"
                    data-log-name="全部"
                    onClick={()=>{this.props.changeTagLoad('')}}>全部</div>
                {
                    this.props.dataList.map((item, index) => {
                        return <div 
                            className={`on-log type-item${this.props.currentId==item.id?' current':''}`} 
                            data-log-region="coupon-lists"
                            data-log-pos={ index }
                            data-log-name={item.name}
                            key={`type-item-${item.id}-${index}`} 
                            onClick={()=>{this.props.changeTagLoad(item.id)}}>{item.name}</div>
                    })
                }
                
            </div>
        );
    }
}

TypeItem.propTypes = {

};

export default TypeItem;