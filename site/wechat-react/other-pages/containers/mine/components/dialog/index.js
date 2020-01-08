import React, { PureComponent } from 'react'

export default class extends PureComponent{
    render() {
        return (
            <div className="mine-portal" onClick={ this.props.showTi }></div>
        )
    }
}