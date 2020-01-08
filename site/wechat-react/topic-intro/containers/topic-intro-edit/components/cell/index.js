import React from 'react';


export default class Cell extends React.Component {
    render () {
        return (
            <div className={"cell " + this.props.className}>
                <div className="ceil-label">
                    <div className={`label`}>
                        {this.props.label}{this.props.optimizeTip && <span className="optimize-tip"></span>}
                    </div>
                    {this.props.labelTip && <p className="label-tip">{this.props.labelTip}</p>}
                </div>
                <div className="content">
                    {this.props.children}
                </div>
                { this.props.needExample && <div className="example on-log" data-log-region={this.props.exampleRegionLog} onClick={this.props.showOptimizeDialog}>示例</div>}
            </div>
        )
    }
}

Cell.defaultProps = {
    className: ''
}
