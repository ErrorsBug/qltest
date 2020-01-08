import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 教师节奖杯
class TeacherCupDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                titleTheme={'white'}
                className="teacher-cup-dialog"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <div className ="qlMT_top">千聊教师节纪念奖杯</div>
                    <div className ="qlMT_content">


                        <p className="thanks">感谢同行，一路有你。</p>
                            

                        <p className="special">教师节纪念奖杯特表彰以下用户：</p>
                        <ul className ="t-live-list">
                            <li>l 资历深，与千聊共同成长</li>
                            <li>l 课程内容优质、授课形式丰富</li>
                            <li>l 认真、严谨、专业的教师精神</li>
                            <li>l 为知识的传播与分享作出贡献</li>
                        </ul>
                        
                        <p className="v-live-tips">奖杯颁发说明：<br/>
                        本奖杯颁发于2016年教师节，是千聊对于在2016.9.9.—2016.9.15期间，新创建的直播间和参与教师节纪念活动的讲师授予的第一个教师节纪念奖杯。
                        </p>
                    </div>
                    <div className="qlMTBottom2">
                        <a href="javascript:;" className="tlbtn_cancel" onClick={this.props.onClose}>关闭</a>
                    </div>

                </div>
            </MiddleDialog>
        );
    }
}

TeacherCupDialog.propTypes = {

};

export default TeacherCupDialog;