import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BottomDialog, Confirm } from 'components/dialog';

class BottomControl extends Component {
    render() {

        let title = `单课名称：<span style="color: #999;">${this.props.courseSettingData.topic}</span>`;

        let items = [{
            key: 'audition',
            icon: '',
            content: '免费试听',
            show: (this.props.courseSettingData.isSingleBuy === 'Y' || this.props.isZeroMoney) ? false: true,
            switchStatus: this.props.courseSettingData.isAuditionOpen === 'Y',
            theme: 'normal'
        }, {
            key: 'hide',
            icon: '',
            content: '隐藏本单课',
            show: this.props.courseSettingData.displayStatus == 'Y',
            theme: 'normal'
        }, {
            key: 'show',
            icon: '',
            content: '取消隐藏本单课',
            show: this.props.courseSettingData.displayStatus == 'N',
            theme: 'normal'
        }, {
            key: 'singleBuy',
            icon: '',
            content: '单节购买',
            show: (this.props.isZeroMoney || this.props.courseSettingData.type === 'public'||this.props.courseSettingData.type === 'encrypt' || this.props.courseSettingData.isAuditionOpen === 'Y') ? false: true,
            switchStatus: this.props.courseSettingData.isSingleBuy === 'Y',
            theme: 'normal'
        },{
            key: 'remove',
            icon: '',
            content: '移出系列课',
            topictype:this.props.courseSettingData.type,
            // show: (!/^(audioGraphic|videoGraphic)$/.test(this.props.courseSettingData.style)),
            show: true,
            theme: 'normal'
        },{
            key: 'sort',
            icon: '',
            content: '单课排序',
            show: true,
            theme: 'normal'
        }];

        if (this.props.courseSettingData.status === 'beginning' && !/^(audioGraphic|videoGraphic)$/.test(this.props.courseSettingData.style)) {
            items.push({
                key: 'end',
                icon: '',
                content: '结束单课',
                show: true,
                theme: 'normal'
            });
        } else if (this.props.courseSettingData.status != 'beginning' || /^(audioGraphic|videoGraphic)$/.test(this.props.courseSettingData.style)){
            items.push({
                key: 'delete',
                icon: '',
                content: '删除单课',
                show: true,
                theme: 'normal'
            });
        }

        if (/^(normal|ppt)$/.test(this.props.courseSettingData.style)) {
            items.push({
                key: 'relay',
                icon: '',
                content: '设置转播',
                show: true,
                theme: 'normal'
            });
        } 

        return (
            <BottomDialog
                {...this.props}
                theme={"list"}
                bghide={true}
                title={title}
                items={items}
                >

            </BottomDialog>
        );
    }
}

BottomControl.propTypes = {
    courseSettingData: PropTypes.object
};

export default BottomControl;
