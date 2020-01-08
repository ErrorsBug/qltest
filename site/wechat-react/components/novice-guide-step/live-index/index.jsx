import React from 'react';

import NoviceGuideStep from '../index';
const {StepContainer, StepBlock, StepPoint, StepGuideSource, StepFrame} = NoviceGuideStep;

/**
 * 直播间主页 新手引导
 */

export default class LiveIndexGuideStep extends React.Component {

    stepKey = 'LIVEINDEXGUIDESTEP'
    jumpKey = 'LIVEINDEXGUIDESTEPJUMP'

    state = {
        step: 1,
        maxStep: 5,
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
            <NoviceGuideStep className="live-index-guide">
                <StepContainer bgUrl="https://img.qlchat.com/qlLive/liveCommon/live-index-guide.jpg" show={true} top={this.state.step == 5 ? '-146%' : 0}>
                    <StepFrame show={this.state.step == 1}>
                        <StepPoint
                            border={false}
                            className="live-setting-point"
                            />
                        <StepBlock className="live-guide-tips live-settting">
                            <StepGuideSource type="up" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 2}>
                        <StepPoint 
                            border={false}
                            className="live-qr-point"
                            />
                        <StepBlock className="live-guide-tips live-qr">
                            <StepGuideSource type="up" className="right" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 3}>
                        <StepPoint 
                            border={false}
                            className="live-share-point"
                            />
                        <StepBlock className="live-guide-tips live-share">
                            <StepGuideSource type="up" className="right" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 4}>
                        <StepPoint 
                            border={false}
                            className="live-banner-point"
                            />
                        <StepBlock className="live-guide-tips live-banner">
                            <StepGuideSource type="up" />
                            <div className="guide-tips"></div>
                        </StepBlock>
                    </StepFrame>
                    <StepFrame show={this.state.step == 5}>
                        <StepPoint 
                            border={false}
                            className="live-classify-point"
                            />
                        <StepBlock className="live-guide-tips live-classify">
                            <StepGuideSource type="up" />
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