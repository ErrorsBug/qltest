import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import { initCard } from './card'
import PressHoc from 'components/press-hoc';

@autobind
export default class extends Component {
    state = {
    }
    componentDidMount() {
        initCard(
            {
                cardWidth:this.props.cardWidth, 
                cardHeight:this.props.cardHeight, 
                moduleList:this.props.moduleList,
                success:(url)=>{
                    this.setState({
                        url
                    })
                    this.props.success&&this.props.success()
                }
        })
    }  
     
    render() {
        const {url=""} = this.state
        const {region='un-canvas-img'} = this.props
        if(!url)return false
        return (
            <PressHoc region={region}>
                <img src={url}/>
            </PressHoc>
        )
    }
}

