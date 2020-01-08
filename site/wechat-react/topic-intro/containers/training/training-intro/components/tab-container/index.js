import React, { Component } from 'react';
import errorCatch from 'components/error-boundary/index';
@errorCatch
class TabContainer extends Component {

	render(){

        const { className, tags, currTagIndex, tagClick, children, evaluationData } = this.props
        return (
            <div
                className={`tab-container ${className}`}
                >
                <div className="tab-bar">
                    {
                        tags.map((item, index) => (
                            <div 
                                key={item.tagKey} 
                                className={`tab-item ${currTagIndex === index ? 'activity' : ''}`}
                                onClick={() => { tagClick(index) }}
                                >
                                <span>{item.tagName}</span>
                                {
                                    item.tagKey == "evaluate" && evaluationData.evaluateNum > 0 &&
                                    <span className="tab-num">{evaluationData.evaluateNum > 999 ? '999+': evaluationData.evaluateNum}</span>
                                }
                            </div>
                        ))
                    }
                </div>
                <div className="tab-content">{children}</div>
            </div>
        )
    }
}

export default TabContainer;