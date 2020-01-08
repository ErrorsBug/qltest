import React, { Component } from 'react';
import { digitFormat } from 'components/util';

class NightAnswer extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        const c = this.props.info.courses[0];
        return (
            <div
                className="recommend-night-answer on-log on-visible"
                onClick={_=> this.props.courseItemTapHandle(c)}
                data-log-id={c.businessId}
                data-log-type={c.businessType}
                data-log-region={this.props.info.code}>
                <div className="night-answer-icon"></div>
                <div className="info">
                    <div className="span">{c.businessName}</div>
                    <div className="span">
                        <span className="tips">{c.remark} | {digitFormat(c.learningNum)}人收听</span>
                    </div>
                </div>
                <div className="play-btn"></div>
            </div>
        )
    }
}

export default NightAnswer;
