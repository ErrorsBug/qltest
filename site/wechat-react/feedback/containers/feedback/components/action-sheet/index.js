import React from 'react';
import SlideInFromBottom from '../slide-in-from-bottom';
import classNames from 'classnames';




export default class ActionSheet extends React.PureComponent {
    static defaultProps = {
        config: [],
    }

    render() {
        return <SlideInFromBottom
            in={this.props.in}
            onClickBg={this.onClose}
            header={this.props.title}
            onClickHeaderClose={this.onClose}
        >
            {this.renderContent}
        </SlideInFromBottom>
    }

    renderContent = () => {
        return <div className="fb-actionsheet">
                <div className="as-list">
                    {this.props.config.map((item, index) => {
                        const isActive = index === this.props.index;

                        return <div key={index}
                            className={classNames('as-item', {active: isActive})}
                            onClick={() => this.onClickItem(index)}
                        >
                            <div className="as-item-content">
                                {typeof this.props.render === 'function' ? this.props.render(item) : item}
                            </div>
                            {
                                isActive && <i className="icon_checked"></i>
                            }
                        </div>
                    })}
                </div>
            </div>
    }

    onClickItem = index => {
        typeof this.props.onChange === 'function' && this.props.onChange(index);
        typeof this.props.onClose === 'function' && this.props.onClose();
    }

    onClose = e => {
        typeof this.props.onClose === 'function' && this.props.onClose(e);
    }
}
