import { findDOMNode } from 'react-dom';
import { mul, locationTo } from 'components/util';


//弹出推送系列课弹框
export function showPushChannelDialog()  {
    this.setState({
        showPushChannelDialog: true,
    })
}

//关闭推送系列课弹框
export function hidePushChannelDialog() {
    this.setState({
        showPushChannelDialog: false,
    });
}

export function onSingleBuy() {
    this.setState({
        singleBuyInputValue: this.state.courseSettingData.money && (this.state.courseSettingData.money || 0) / 100
    });

    this.refs.singleBuyDialog.show();
}

/* 确认推送*/
// export async function onConfirmPush(tag) {
//     if (tag === 'confirm') {
//         if (this.props.courseList.length === 0) {
//             window.toast('暂无系列课课程，请新建系列课课程再推送');
//             return;
//         }

//         if (this.state.leftPushNum <= 0) {
//             window.toast('本周推送次数已用完！');
//             return;
//         }
//         this.refs.pushDialog.hide()
//         setTimeout(() => {
//             location.href = `/wechat/page/course/push/channel/${this.data.channelId}?sync=${(this.state.channelPushTimelineChecked && this.state.leftFeedPushNum > 0) ? 'Y' : 'N'}&liveId=${this.props.channelInfo.liveId}`
//         }, 50);
//     }
// }

/**
 * 开启单节购买
 * @param  {[type]} tag [description]
 * @return {[type]}     [description]
 */
export async function handleConfirmSingleBuy(tag) {
    if (tag === 'confirm') {
        if (/\d+[.]\d{3,}/.test(this.state.singleBuyInputValue + '')) {
            window.toast("话题价格：请输入最多两位小数的非负数");
            return false;
        }
        if (!this.state.singleBuyInputValue) {
            window.toast("话题价格：不能为空");
            return false;
        }

        this.setState({
            courseSettingData: {
                ...this.state.courseSettingData,
                money: mul(this.state.singleBuyInputValue, 100)
            }
        });
        setTimeout(() => {
            this.doSingleBuy();
        }, 0);
    }
}

export async function doSingleBuy() {
    let courseId = this.state.courseSettingData.id;
    let money = this.state.courseSettingData.money / 100;
    let isSingleBuy = this.state.courseSettingData.isSingleBuy === 'Y' ? 'N' : 'Y';
    if (money < 1 || money > 50000) {
        window.toast("话题价格：请输入1-50000之间的价格");
        return false;
    }

    try {
        const result = await this.props.fetchSingleBuy(courseId, money, isSingleBuy, true);

        window.toast(result.state.msg);
        if (result.state.code === 0) {
            this.props.updateCourseData(courseId, {
                isSingleBuy: isSingleBuy,
                money: this.state.courseSettingData.money
            });

            this.setState({
                courseSettingData: {
                    ...this.state.courseSettingData,
                    isSingleBuy: isSingleBuy,
                    money: this.state.courseSettingData.money
                }
            });
        }
        this.refs.singleBuyDialog.hide();
    } catch (error) {
        console.error(error);
    }
}


export async function handleConfirmMoveOut(tag) {
    if (tag === 'confirm') {
        if (/\d+[.]\d{3,}/.test(this.state.moveOutInputValue + '')) {
            window.toast("话题价格：请输入最多两位小数的非负数");
            return false;
        }
        if (!this.state.moveOutInputValue) {
            window.toast("话题价格：不能为空");
            return false;
        }

        this.setState({
            courseSettingData: {
                ...this.state.courseSettingData,
                money: mul(this.state.moveOutInputValue, 100),
                topicCount: this.state.topicCount - 1,
            }
        });
        setTimeout(() => {
            this.doMoveOut();
        }, 0);
    }
}


export async function doMoveOut() {
    let courseId = this.state.courseSettingData.id;
    let money = this.state.courseSettingData.money / 100;
    if (money < 1 || money > 50000) {
        window.toast("话题价格：请输入1-50000之间的价格");
        return false;
    }

    try {
        const result = await this.props.fetchRemoveCourse(courseId, this.state.courseSettingData.money, true);

        window.toast(result.state.msg);
        if (result.state.code === 0) {
            this.props.updateCourseData(courseId, {
                money: this.state.courseSettingData.money
            });

            this.setState({
                courseSettingData: {
                    ...this.state.courseSettingData,
                    money: this.state.courseSettingData.money,
                },
                courseList: this.state.courseList.filter(item => item.id != courseId)
            });
        }
        this.refs.moveOutDialog.hide();
    } catch (error) {
        console.error(error);
    }
}
export function onMoveOut() {
    this.setState({
        moveOutInputValue: this.state.courseSettingData.money && (this.state.courseSettingData.money || 0) / 100
    });

    this.refs.moveOutDialog.show();
}


/**
 * 显示金字塔弹框
 * 
 * @export
 * @param {any} e 
 */
export function showPyramidDialog(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
        showPyramidDialog: true
    });
}
/**
 * 关闭金字塔
 * 
 * @export
 */
export function closePyramidDialog() {
    this.setState({
        showPyramidDialog: false
    });
}
