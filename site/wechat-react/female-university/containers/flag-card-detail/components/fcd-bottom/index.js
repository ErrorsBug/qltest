import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat } from 'components/util';



@autobind
export default class extends PureComponent {
    state = {
        isShowProcess: false
    }

    componentDidMount = () => {
    };

    render() {
        const {
            isShowWithdraw,
            className,
            id,
            userId,
            status,
            money,
            desc,
            helpNum,
            cardDate,
            cardTime,
            createTime,
            updateTime,
            userName,
            userHeadImg,
            flagZs,
            fetchFlagHelpAdd } = this.props;
        // const status = 'fail'  
        return (
            <Fragment>
                <div className="fcd-bottom">
                    <div className="fcd-info">
                        <div className="fcd-avator"><img src={userHeadImg}/></div>
                        <div className="fcd-word">我正在千聊女子大学学习，这里有很多很棒的课程和优秀的校友，如果你感兴趣，可以进来了解下哦! ~</div>
                    </div>
                    <div className="fs-intro on-log on-visible" 
                        data-log-name='招生简章'
                        data-log-region="un-flag-show-picture"
                        data-log-pos="0"
                        onClick={()=>{locationTo(`/wechat/page/university/home`)}}>
                        <img src={flagZs?.keyA}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}
