import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class TabView extends React.PureComponent {
    static propTypes = {
        config: PropTypes.array,
        activeIndex: PropTypes.number,
        onClickItem: PropTypes.func,
    }

    static defaultProps = {
        config: [],
        activeIndex: 0,
    }

    render() {
        return (
            <div className={classNames('co-tab-view-v2', this.props.className)}>
                {
                    this.props.config.map((item, index) => {
                        const cln = classNames('tab-item', item.className, {
                            active: index == this.props.activeIndex,
                        });

                        return <div key={index}
                            className={cln}
                            onClick={() => this.onClickItem(index)}
                            {...item.attrs}
                        >
                            <p>
                                {item.name}
                            </p>
                        </div>
                    })
                }
            </div>
        )
    }

    onClickItem = index => {
        typeof this.props.onClickItem === 'function' && this.props.onClickItem(index);
    }
}
