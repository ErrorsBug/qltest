import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Confirm from './confirm';
import ScrollToLoad from '../scrollToLoad';

class ListDialog extends Component {


    dangerHtml = content => {
        return { __html: content }
    }

    state = {
        list: []
    }

    componentDidMount() {
        this.setState({
            list: this.props.items
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.items
        });
    }

    show() {
        this.refs.dialog.show();
    }

    hide() {
        this.refs.dialog.hide();
    }

    /**
     * 获取选中的项目
     */
    getSelectedItem() {
        return this.state.list.filter(item => item.checked)[0]
    }

    onSelectItem(index) {
        this.setState({
            list: this.state.list.map((item, i) => {
                if (i === index) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }

                return item;
            })
        });
    }

    render() {
        let {
            title,
            buttons,
            className,

            onBtnClick,
            noMore,
            loadNext,
        } = this.props;

        if (loadNext == null) {
            loadNext = () => {};
            noMore = true;
        }

        return (
            <Confirm
                ref='dialog'
                title={ title }
                buttons={ buttons }
                className={ className + ' co-list-dialog' }
                onBtnClick={ (key) => onBtnClick(key, this.getSelectedItem()) }
            >
                <div className='co-list-container'>
                    <ScrollToLoad
                        className='co-list-wrap'
                        loadNext={ loadNext }
                        noMore={ noMore }
                        >
                        {
                            this.state.list.map((item, index) => (
                                <li 
                                    key={ `co-list-item-${item.key}` }
                                    className={`co-list-dialog-item ${item.checked ? 'icon_checked' : ''}` }
                                    onClick={ () => this.onSelectItem(index) }
                                    dangerouslySetInnerHTML={ this.dangerHtml(item.content) }></li>
                            ))
                        }
                    </ScrollToLoad>
                </div>
            </Confirm>
        );
    }
}

ListDialog.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        // 选中的回调值
        key: PropTypes.any,
        // 内容，可以是一个html字符串，将原封不动的放进item中
        content: PropTypes.string,
        // 是否选中
        checked: PropTypes.bool,
    })).isRequired,

    // 列表内部滚动加载的回调方法
    loadNext: PropTypes.func,
    // 没有更多了
    noMore: PropTypes.bool,
};

ListDialog.defaultProps = {
    loadNext: null
}

export default ListDialog;