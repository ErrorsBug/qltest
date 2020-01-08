import React from 'react';

import NoviceGuideStep from '../index';
const {StepContainer, StepBlock, StepPoint, StepGuideSource, StepFrame} = NoviceGuideStep;

/**
 * 直播间工作台 新手引导
 */

export default class LiveIndexBarGuideStep extends React.Component {

    stepKey = 'LIVEINDEXBARGUIDESTEP'
    jumpKey = 'LIVEINDEXBARGUIDESTEPJUMP'

    state = {
        step: 1,
        maxStep: 4,
        show: false
    }

    componentDidMount () {
        const isJump = window.sessionStorage && sessionStorage.getItem(this.jumpKey)
        if (!isJump) {
            const step = window.localStorage && localStorage.getItem(this.stepKey)
            if (!step || step < this.state.maxStep) {
                this.setState({
                    show: true,
                    step: parseInt(step || 1)
                })
            }
        }
    }

    nextStep = () => {
        const {
            step,
            maxStep
        } = this.state
        if (step < maxStep) {
            window.localStorage && localStorage.setItem(this.stepKey, step + 1)
            this.setState({
                step: step + 1
            })
        } else {
            window.localStorage && window.localStorage.setItem(this.stepKey, 'Y')
            this.setState({
                show: false
            })
            this.props.onClose && this.props.onClose()
        }
    }

    onJump = () => {
        window.sessionStorage && window.sessionStorage.setItem(this.jumpKey, 'Y')
        this.setState({
            show: false
        })
        this.props.onClose && this.props.onClose()
    }

    render () {
        return this.state.show ? (
            <NoviceGuideStep className="live-index-bar-guide">
                
                <StepContainer bgUrl="https://img.qlchat.com/qlLive/liveCommon/live-index-guide.jpg" show={true}></StepContainer>
                
                <StepFrame show={this.state.step == 1}>
                    <StepPoint
                        border={false}
                        className="live-workbench-point"
                        />
                    <StepBlock className="live-guide-tips live-settting">
                        <div className="guide-tips"></div>
                        <StepGuideSource type="down" />
                    </StepBlock>
                </StepFrame>
                <StepFrame show={this.state.step == 2}>
                    <StepPoint 
                        border={false}
                        className="live-create-point"
                        />
                    <StepBlock className="live-guide-tips live-create">
                        <div className="guide-tips"></div>
                        <StepGuideSource type="down" />
                    </StepBlock>
                </StepFrame>
                <StepFrame show={this.state.step == 3}>
                    <StepPoint 
                        border={false}
                        className="live-student-point"
                        />
                    <StepBlock className="live-guide-tips live-student">
                        <div className="guide-tips"></div>
                        <StepGuideSource type="down" />
                    </StepBlock>
                </StepFrame>
                <StepFrame show={this.state.step == 4}>
                    <StepPoint 
                        border={false}
                        className="live-message-point"
                        />
                    <StepBlock className="live-guide-tips live-message">
                        <div className="guide-tips"></div>
                        <StepGuideSource type="down" className="right" />
                    </StepBlock>
                </StepFrame>
                <StepGuideSource type="ok" className="ok-btn" onClick={this.nextStep} />
                {
                    this.state.step < this.state.maxStep ?
                    <StepBlock className="jump-btn" onClick={this.onJump}>跳过&nbsp;{this.state.step}/{this.state.maxStep}</StepBlock> : null
                }
            </NoviceGuideStep>
        ) : null
    }
}