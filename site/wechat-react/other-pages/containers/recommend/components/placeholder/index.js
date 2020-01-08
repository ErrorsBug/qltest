import React, { Component } from 'react';
import { digitFormat } from 'components/util';

class Placeholder extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        return (
            <div className="recommend-boutique block-placeholder" >
                <div className="block-header">
                    <span className="title">热门新品</span>
                </div>
                <div className="boutique-container">
                    <div className="main-item" ></div>
                    <div className="sub-item-wrap">
                        <div className="content-wrap">
                            <div className="sub-item"></div>
                            <div className="sub-item"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Placeholder;
