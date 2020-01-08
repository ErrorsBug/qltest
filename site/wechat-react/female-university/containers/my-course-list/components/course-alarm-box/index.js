import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { autobind } from 'core-decorators';

@withStyles(styles)
@autobind
class CourseAlarm extends Component {

    state = {
        portalDom:null,
        isShowQr:false
    }

    componentDidMount() {
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
        // this.toggleQr();
    }

    toggleQr() {
        this.setState({
            isShowQr:!this.state.isShowQr
        })
        this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()
    }

    onClickRemind(){
        if(!this.props.qrcode){
            this.props.showSetAlarm && this.props.showSetAlarm();
        }else{
            this.toggleQr();
        }
    }
    
    render() {
        const { coursePlan } = this.props;
        if (!this.state.portalDom) {
            return null
        }
        return (
            <div className={`${styles['course-list-page-alarm']} `}>
                <div className={`${styles['main']}`}> 
                    <div className={`${styles['left']}`}>
                        <div className={`${styles['course-num']}`}>已添加 <var>{coursePlan.courseNum}</var> 个内容到计划中</div>
                        <div className={`${styles['course-duration']}`}>共{coursePlan.sectionNum}节，{coursePlan.duration}分钟，预计{coursePlan.days}天学完</div>
                    </div>
                    <div className={`${styles['btn-alarm']} `} 
                        data-log-name="学习提醒"
                        data-log-region="un-btn-alarm"
                        data-log-pos="0"
                        onClick={ this.onClickRemind}>学习提醒</div>
                </div>

                {
                    createPortal(       
                        <MiddleDialog
                            show={this.state.isShowQr}
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            buttons={null}
                            close={true}
                            title="关注公众号"
                            className={`${styles['courseList-page-followDialog']}`}
                            onClose={ this.toggleQr}>
                            <div className={`${styles['main']}`}>
                                <img src={this.props.qrcode || "//open.weixin.qq.com/qr/code?username=qianliaoEdu"} className={`${styles['qrcode']}`} alt="" />
                                <span>长按识别二维码关注，其他同学都已设置提醒了哦</span>
                            </div>
                        </MiddleDialog>
                        ,this.state.portalDom
                    )
                }
            </div>
        );
    }
}

CourseAlarm.propTypes = {

};

export default CourseAlarm;