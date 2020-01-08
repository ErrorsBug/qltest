import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators'; 

@autobind
export default class extends PureComponent {
    state={
        className:''
    }
    start(){
        this.setState({
            className:'active'
        }) 
    }
    end(){
        this.setState({
            className:''
        }) 
    }
    render() {
        const { children} = this.props;
        const { className='' } = this.state;
        return (
            <div className={ `fl-click-btn ${ className }` } onTouchStart={this.start} onTouchEnd={this.end}>
                {children}
            </div>
        )
    }
}