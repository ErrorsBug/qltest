import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';


class InformBar extends Component {

    state = {
        informText1 : "",
        informText2 : "",
    }

    data = {
        informListIndex: 0,
        timestamp: 4000,
        informList : [
            "sssssssaaasssss1",
            "sssvbbsdssss2",
            "sssswertyssss3",
            "sssssdfgs4",
            "ssnkjnjkjnssss5",
            "fhjuyfggggvbnsss6",
            "jhuyghvbjkhgcss7",
            "sjinjaawklkllkss8"
        ],
    }

    componentDidMount = () => {
        
        this.setState({
            informText1: this.props.informList[0],
            informText2: this.props.informList[1],
        })
        
        if(this.props.timestamp) {
            this.data.timestamp = this.props.timestamp
        }

        const that = this
        let informList = findDOMNode(this.refs["inform-list"])
        let informText1 = findDOMNode(this.refs["inform-text1"])
        let informText2 = findDOMNode(this.refs["inform-text2"])
        
        setInterval(function() {
            if(that.data.informListIndex < that.props.informList.length -1) {
                that.data.informListIndex ++;
            } else {
                that.data.informListIndex = 0;
            }
            informList.style.transition = "all .5s ease-out"
            informList.style.top = "-100%"

            setTimeout(function() {
                informList.style.transition = ""
                informList.style.top = "0"

                if(that.data.informListIndex == that.props.informList.length - 1) {
                    informText1.innerHTML = that.props.informList[that.data.informListIndex]
                    informText2.innerHTML = that.props.informList[0]
                } else {
                    informText1.innerHTML = that.props.informList[that.data.informListIndex]
                    informText2.innerHTML = that.props.informList[that.data.informListIndex + 1]
                }
            }, 500);
        }, this.data.timestamp);

    }

    render() {
        return (
            <div className="inform-con">
                <div className="inform-list" ref="inform-list">
                    <div className="inform"><span className="inform-tag"></span><span className="inform-text" ref="inform-text1">{this.props.informList[0]}</span></div>
                    <div className="inform"><span className="inform-tag"></span><span className="inform-text" ref="inform-text2">{this.props.informList[1]}</span></div>
                </div>
            </div>
        );
    }
}

export default InformBar;