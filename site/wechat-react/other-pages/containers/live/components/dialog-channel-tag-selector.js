import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';
import Switch from 'components/switch';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import { moveChannelIntoTag } from 'actions/live';
import { ListDialog } from 'components/dialog';

@autobind
class DialogChannelTagSelector extends PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        channelTagList: []
    }

    componentDidMount() {
    }

    show() {
        this.refs.dialog &&
        this.refs.dialog.show();

        if (this.state.channelTagList.length === 0) {
            this.fetchChannelTags();
        }
    }

    hide() {
        this.refs.dialog &&
        this.refs.dialog.hide();
    }

    async fetchChannelTags() {
        const result = await this.props.client.query({
            query: gql`
                query ChannelTags($liveId: String, $type: String) {
                    # 获取系列课分类列表
                    channelTags(liveId: $liveId, type: $type) {
                        # 分类ID
                        id
                        # 分类名称
                        name
                        # 状态
                        status
                        # 移动后系列课分类位置
                        targetNum
                    }
                }
            `,

            variables: {
                liveId: this.props.liveId,
                type: 'all'
            }
        });

        const tagList = [ { id: '0', name: '全部（即将系列课移出分类）' }, ...result.data.channelTags ];

        this.setState({
            channelTagList: tagList.map(item => {
                let temp = {
                    checked: item.id == this.props.defaultTag,
                    ...item
                }
                return temp;
            })
        });
    }

    async onBtnClick(key, res) {
        if (key == 'confirm') {
            const result = await moveChannelIntoTag(this.props.channelId, res.key);
            
            window.toast(result.state.msg);
            
            if (result.state.code == 0) {
                this.props.onChangeComplete(res.key);
            }
        }
    }

    render() {
        return (
            <ListDialog
                ref='dialog'
                title='选择系列课分类'
                items={
                    this.state.channelTagList.map(item => ({
                        key: item.id,
                        content: item.name,
                        checked: item.checked
                    }))
                }
                onBtnClick={ this.onBtnClick }
            />
        );
    }
}

DialogChannelTagSelector.propTypes = {
    // 直播间id
    liveId: PropTypes.string,
    // 默认选中的tagId
    defaultTag: PropTypes.string.isRequired,
    // 系列课ID
    channelId: PropTypes.string,
    // 移动到系列课完毕
    onChangeComplete: PropTypes.func,
};

export default withApollo(DialogChannelTagSelector, {
    withRef: true
});