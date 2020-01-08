import React, { PureComponent } from 'react'

const ranks = ['最新', '总榜']

export default class extends PureComponent {
    changeSwitch = (idx) => {
        this.props.changeSwitch(idx);
    }
    render() {
        const { idx = 0, isAllJoin, addJoinCourse, isBtnJoin, type } = this.props;
        return (
            <div className="tr-nav-cont on-visible"
                data-log-name="排行榜点击区域"
                data-log-region="un-top-box"
                data-log-pos={ idx }>
                <div className="tr-switch-box">
                    { ranks.map((item, index) => (
                        <span 
                            data-log-name={ item }
                            data-log-region={ `un-top-${ type == "course" ? 'course' : 'book' }` }
                            data-log-pos={ idx }
                            key={ `${ item }-${ index }` }
                            className={ `on-log ${ index === idx ? 'action' : '' }` }
                            onClick={ () => this.changeSwitch(index) }
                            >{ item }</span>
                    )) }
                </div>
                {/* <div className={ `tr-course-btn ${ isBtnJoin && isAllJoin ? 'all-join' : '' }` } onClick={ addJoinCourse }>{ isAllJoin ? '进入课表查看' : '一键添加' }</div> */}
            </div>
        );
    }
}