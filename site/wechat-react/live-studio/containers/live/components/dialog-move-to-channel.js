import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ListDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import { moveIntoChannel } from 'actions/live';

@graphql(gql`
    query ChannelList($liveId: String, $page: Int, $size: Int = 20) {
        changeChannelList(liveId: $liveId, page: $page, size: $size) {
            id
            name
        }
    }
`, {
    withRef: true,    
    options: props => ({
        variables: {
            liveId: props.liveId,
            page: 1
        },
        ssr: false
    }),
    props: ({ ownProps, mutate, data, ...others }) => ({
        ...others,
        data,
        fetchNext(page, liveId) {
            return data.fetchMore({
                variables: {
                    page,
                    liveId,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }

                    return {
                        ...previousResult,
                        changeChannelList: [ ...previousResult.changeChannelList, ...fetchMoreResult.changeChannelList ]
                    }
                }
            })
        }
    }),
})
@autobind
class DialogMoveToChannel extends PureComponent {

    state = {
    }

    data = {
        page: 1,
        noMore: false,
    }

    componentDidMount() {
    }

    async onBtnClick(tag, res) {
        if (tag === 'confirm') {
            if (!res.key) {
                window.toast('未选择系列课');
                return;
            }
            const result = await moveIntoChannel(this.props.topicId, res.key);

            window.toast(result.state.msg);

            if (result.state.code == 0) {
                this.refs.listDialog.hide();
                this.props.onMoveComplete();
            }
        }
    }

    show() {
        this.refs.listDialog &&
        this.refs.listDialog.show();
    }

    async fetchMore(next) {
        const result = await this.props.fetchNext(this.data.page + 1, this.props.liveId);

        this.data.page += 1

        // let noMore = false;
        if (result.data.changeChannelList.length < 20) {
            // noMore = true;

            this.setState({
                noMore: true,
            });
        }

        next();
    }

    render () {
        const {
            loading,
            changeChannelList
        } = this.props.data;

        if (loading) {
            return null;
        }

        return (
            <ListDialog
                ref='listDialog'
                title='选择你要移动的系列课'
                items={
                    changeChannelList.map(item => ({
                        key: item.id,
                        content: item.name,
                    }
                )) }
                loadNext={ this.fetchMore }
                noMore={ this.state.noMore }
                onBtnClick={ this.onBtnClick }
            />
        );
    }
};

export default DialogMoveToChannel;