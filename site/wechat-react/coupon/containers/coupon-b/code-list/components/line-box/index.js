import React from "react";

export class LineBox extends React.PureComponent {
    render () {
        return (
            <div className="line-box">
                <div className="line-box-left">{this.props.left}</div>
                <div className="line-box-right">{this.props.right}</div>
            </div>
        )
    }
}