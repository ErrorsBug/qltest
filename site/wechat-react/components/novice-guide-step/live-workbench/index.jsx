import React from 'react';

import NoviceGuideStep from '../index';
const {StepContainer, StepBlock, StepPoint, StepGuideSource, StepFrame} = NoviceGuideStep;

/**
 * 直播间工作台 新手引导
 */

export default class LiveWorkbenchGuideStep extends React.Component {

    stepKey = 'LIVEWORKBENCHGUIDESTEP'
    jumpKey = 'LIVEWORKBENCHGUIDESTEPJUMP'

    state = {
        step: 1,
        maxStep: 3,
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
        let top = 0
        if (this.state.step == 2) {
            top = '-67%'
        } else if (this.state.step == 3) {
            top = '-160%'
        }
        return this.state.show ? (
            <NoviceGuideStep className="live-workbench-guide">
                <StepContainer bgUrl={`https://img.qlchat.com/qlLive/liveCommon/live-workbench-guide-${this.props.form}.jpg`} show={true}  top={top}>
                    <StepFrame show={this.state.step == 1}>
                        <StepPoint
                            border={false}
                            className="live-user-point"
                            />
                        <StepBlock className="live-guide-tips live-user">
                            <StepGuideSource type="up" className="left" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 2}>
                        <StepPoint 
                            border={false}
                            className="live-reprint-point"
                            />
                        <StepBlock className="live-guide-tips live-reprint">
                            <StepGuideSource type="up" className="left" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 3}>
                        <StepPoint 
                            border={false}
                            className="live-recovery-point"
                            />
                        <StepBlock className="live-guide-tips live-recovery">
                            <StepGuideSource type="up" className="right" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                </StepContainer>
                <StepGuideSource type="ok" className="ok-btn" onClick={this.nextStep} />
                {
                    this.state.step < this.state.maxStep ?
                    <StepBlock className="jump-btn" onClick={this.onJump}>跳过&nbsp;{this.state.step}/{this.state.maxStep}</StepBlock> : null
                }
            </NoviceGuideStep>
        ) : null
    }
}