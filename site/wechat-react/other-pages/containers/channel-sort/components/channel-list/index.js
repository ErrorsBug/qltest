import React, { Component } from 'react';
import PropTypes from 'prop-types';
// actions


class ChannelList extends Component {

    async changeSort(e){
        var id =e.currentTarget.dataset.id;
        var weight=e.currentTarget.value;
        
        this.props.changeChannelSort(id,weight);

        console.log("11");

    }
    render() {
    //console.log(this.props.items);

    var itemLi=this.props.items.map((item)=>{
        return (     
            <li>
                <div className="channel-img"><img src={`${item.headImage}`} /></div>
                <div className="channel-title elli">{item.name}</div>
                <div className="channel-Num">
                    <input type="text" value={item.weight} data-id={item.id} onChange={this.changeSort.bind(this)} />
                </div>
            </li>
        );
    })

    return (
        <ul className="channel-list">
            {itemLi}
            
        </ul>
    );
    };
};

ChannelList.propTypes = {
    
};

export default ChannelList;