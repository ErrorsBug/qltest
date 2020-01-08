
import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'
import { locationTo, formatDate } from 'components/util'
import CampStatus from '../camp-status'
 

@autobind
export default class extends Component {
    state = {  
    }  
     

    componentDidMount() { 
        
    } 
     
    render() {
        const {text='限',children=0,point='人'} = this.props 
        return (
            <div className="ln-course-limit">
                <span className="ln-course-limit-text">{text}</span>
                <span className="ln-course-limit-num">{children}</span>
                <span className="ln-course-limit-point">{point}</span>
            </div>
        )
    }
}

