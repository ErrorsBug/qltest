import React, { PureComponent } from 'react'

export default class extends PureComponent{
    render() {
        return (
            <div className="ch-portal" onClick={ this.props.showTi }>
                {this.props.children}
            </div>
        )
    }
}