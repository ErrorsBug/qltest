import React from 'react';
import { connect } from 'react-redux';

const reducer = state => {
    return {
        totalSecond: state.shortKnowledge.totalSecond
    }
}

const actions = {

}
class Progress extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){

    }

    render(){
        let left = this.props.totalSecond / 60 * 100 - 100
        left = left > 0 ? 0 : left
        return (
            <div className="progress-container">
                <span className="second">{this.props.totalSecond}S</span>
                <div className="progress">
                    <div className="red" style={{left: left + '%'}}></div>
                </div>
                <span className="second">60S</span>
            </div>
        )
    }
}

export default connect(reducer, actions)(Progress)

