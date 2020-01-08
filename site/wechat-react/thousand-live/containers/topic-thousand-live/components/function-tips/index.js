import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

@autobind
class FunctionTips extends Component {

    state = {
        showBox: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            shownBtips: 1,
        }
    }
    componentDidMount() {
        this.isFirstVisit();
    }

    hideFunctionTips() {
        this.setState({
            showBox: false,
        })
        this.onChangeStatus(false)
    }
    

    handleClick() {
        if (this.props.allowSpeak) {
            if (this.state.shownBtips !== 5) {
                this.setState({
                    shownBtips: this.state.shownBtips + 1
                });
            } else {
                localStorage.setItem('visitedTopicB', 'Y');
                this.hideFunctionTips()
            }
        } else {
            localStorage.setItem('visitedTopicC', 'Y');
            this.hideFunctionTips();
        }
    }

    /**
     * 检查用户是否第一访问话题
     * 管理员显示发言提示
     * C端切有开启语音上墙，显示上墙提示
     */
    isFirstVisit(){
        const visitedTopicB = localStorage.getItem('visitedTopicB') || false;
        const visitedTopicC = localStorage.getItem('visitedTopicC') || false;
        if (this.props.allowSpeak && this.props.topicStatus != 'ended') {
            if (visitedTopicB != 'Y') {
                
                this.setState({
                    showBox: 'B',
                })
                this.onChangeStatus(true)
                return true;
            }
        } else if(this.props.isAudioOpen == 'Y' && this.props.topicStatus != 'ended'){
            if (visitedTopicC != 'Y') {
                this.setState({
                    showBox: 'C',
                })
                this.onChangeStatus(true)
                return true;
            }
        }
        this.onChangeStatus(false)
    }

    onChangeStatus = (isShow) => {
        this.props.onChangeStatus && this.props.onChangeStatus(isShow)
    }

    render() {

        let tips = null

        if (this.state.showBox == 'B') { // B端引导
            switch (this.state.shownBtips) {
                case 1:
                    tips = <div className="b-tip-1"><p className="tips-btn type-1"></p></div>
                    break
                case 2:
                    tips = <div className="b-tip-2"><p className="tips-btn type-1"></p></div>
                    break
                case 3:
                    tips = <div className="b-tip-3"><p className="tips-btn type-2"></p></div>
                    break
                case 4:
                    tips = <div className="b-tip-4"><p className="tips-btn type-3"></p></div>
                    break
                default:
                    tips = <div className="b-tip-5"><p className="tips-btn type-4"></p></div>
                    break
            }
            tips = <div className={`b-tip-background${this.props.topicStyle == 'ppt' && this.props.showLiveBox ? ' isPPT' : ''}`}>{tips}</div>
        } else { // C端引导
            tips = <div className="c-tip-1"></div>
        }

        return (
            
                this.state.showBox ?
                    <div className="function-tip" onClick={this.handleClick}>
                        {tips}
                    </div>
                : null
            
        )
    }
}

FunctionTips.propTypes = {

};

export default FunctionTips;