import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { BottomDialog } from 'components/dialog';
@autobind
class ActionSheet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            status: this.props.show.title
        }
    }

    componentWillReceiveProps (nextProps)  {
        if (nextProps.show) {
            this.setState({
                status: nextProps.show.title
            })
        }
    }

    async onItemClick(status) {
        this.setState({
            status
        })
    }

    handleOnSure() {
        this.props.changeStatus(this.state.status)
        this.props.onClose()
    }
    render() {
        return (
            <div className='action-sheet-container guest-list-bottom'>
                <BottomDialog
                    className="guest-list-bottom-dialog"
                    show={ this.props.show }
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: '嘉宾',
                                content: '设置为嘉宾',
                                show: true,
                            },
                            {
                                key: '主讲人',
                                content: '设置为主讲人',
                                show: true,
                            },
                            {
                                key: '主持人',
                                content: '设置为主持人',
                                show: true,
                            },
                            {
                                key: '特邀主持人',
                                content: '设置为特邀主持人',
                                show: true,
                            }
                        ]
                    }
                    title={this.props.title}
                    close={this.props.close}
                    closeText={this.props.closeText}
                    onClose={ this.props.onClose }
                    onItemClick={ this.onItemClick }
                    activeString={this.state.status}
                    showSure={this.state.status}
                    onSure={this.handleOnSure}
                    onDelete={this.props.hide}
                    sure="完成"
                >
                </BottomDialog>
            </div>
        );
    }
}

ActionSheet.propTypes = {
    // 是否显示
    show: PropTypes.bool.isRequired,
};


module.exports = ActionSheet