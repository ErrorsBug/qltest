import React, { Component } from 'react';

class ShareTipsBox extends Component {
    state = {
        show: false,
        isSwitchOn: false,
    }
    show(){
        this.setState({
            show: true
        });
    }
    hide(){
        this.setState({
            show: false
        }, this.props.onHide);
    }

    onClickSwitch = () => {
        this.setState({
            isSwitchOn: !this.state.isSwitchOn,
        })
    }

    stopPropagation = e => {
        e.stopPropagation();
    }

    render() {
        const { distributionObj = {} } = this.props;
        const isInviteReturn = distributionObj.type === 'inviteReturn';
        const sharePercent = distributionObj.sharePercent;

        if(this.state.show){
            return (
                <div className="share-tips-box" onClick={this.hide.bind(this)}>
                    <div className="arrow"></div>
                    <div className="cartoon" onClick={this.stopPropagation}></div>
                    
                    <div className="win" onClick={this.stopPropagation}>
                        <div className="title">点击右上角“…”发送给好友</div>

                        {
                            (sharePercent || isInviteReturn) &&
                            <div className={`switch${this.state.isSwitchOn ? ' on' : ''}`} onClick={this.onClickSwitch}>
                                {
                                    isInviteReturn
                                        ?
                                        '组队返学费规则'
                                        :
                                        '课代表规则'
                                }
                                <i className="icon_down"></i><i className="icon_up"></i>
                            </div>
                        }
                        
                        {
                            !this.state.isSwitchOn ? false : isInviteReturn
                                ?
                                <div className="content">
                                    <p>1.{distributionObj.data.missionDetail.inviteTotal}位朋友成功购买学习，你将获得{distributionObj.data.missionDetail.returnMoney}元学费返还</p>
                                    <p>2.未在有效期内完成任务，将不能获得学费返还</p>
                                </div>
                                :
                                <div className="content">
                                    <p>1.朋友成功购买学习，你将获得{distributionObj.sharePercent}%的奖励</p>
                                    <p>2.奖励金以朋友支付金额为准，而不是课程价格</p>
                                    <p>3.打卡训练营分成不包括契约金</p>
                                    <p>4.如果您正在参与“组队学返学费”活动，不能获得该奖励</p>
                                </div>
                        }
                    </div>
                </div>
            );
        }else return null;
    }
}

ShareTipsBox.propTypes = {

};

export default ShareTipsBox;