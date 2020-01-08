import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Pitcure from 'ql-react-picture';
import ActionSheet from '../action-sheet';
import UploadImage from '../upload-image';
import { formatDate } from 'components/util';




class FbItem extends React.PureComponent {
    static propTypes = {
        isStatic: PropTypes.bool, // 静态展示模式
        title: PropTypes.string,
        isRequire: PropTypes.bool,
    }

    render() {
        const cln = classNames('fb-item', this.className, {
            'is-static': this.props.isStatic
        }, this.props.className);

        return <div className={cln} onClick={this.onClick}>
            <div className="fb-item-title">
                {this.props.title}
                {
                    !this.props.isStatic && this.props.isRequired &&
                    <span>*</span>
                }
            </div>
            <div className="fb-item-content">
                {
                    this.renderContent && this.renderContent()
                }
            </div>
        </div>
    }
}




export class FbItemRadio extends FbItem {
    static propTypes = {
        config: PropTypes.array,
        index: PropTypes.number,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        config: [],
    }

    className = 'fb-item-radio'

    state = {
        index: undefined,
    }

    renderContent() {
        const activeIndex = this.props.index === undefined ? this.state.index : this.props.index;

        if (this.props.isStatic) {
            const activeItem = this.props.config[activeIndex];
            return activeItem && activeItem.name;
        }

        return <div className="radio-list">
        {
            this.props.config.map((item, index) => {
                return <div key={index}
                    className={classNames('radio-item', {active: index == activeIndex})}
                    onClick={() => this.onClickItem(index)}
                >{item.name}</div>
            })
        }
        </div>
    }

    onClickItem = index => {
        this.setState({
            index
        })
        typeof this.props.onChange === 'function' && this.props.onChange(index);
    }
}




export class FbItemSelect extends FbItem {
    static propTypes = {
        placeholder: PropTypes.string,
    }

    state = {
        isShowActionSheet: false,
    }

    className = 'fb-item-select'

    renderContent() {
        const activeItem = this.props.config && this.props.config[this.props.index];
        const isShowContent = this.props.isStatic || activeItem;

        return <div className={classNames('select-result', {placeholder: !isShowContent})}>
            <span className="one-row">
                {
                    isShowContent
                        ?
                        typeof this.props.render === 'function'
                            ?
                            this.props.render(activeItem)
                            :
                            this.props.render
                        :
                        this.props.placeholder
                }
            </span>
            {
                !this.props.isStatic && <i className="icon_enter"></i>
            }
            {
                !this.props.noActionSheet &&
                <ActionSheet
                    in={this.state.isShowActionSheet}
                    title={this.props.title}
                    config={this.props.config}
                    index={this.props.index}
                    render={this.props.render}
                    onClose={this.onCloseActionSheet}
                    onChange={this.props.onChange}
                />
            }
        </div>
    }

    onClick = () => {
        if (this.props.isStatic) return;
        if (typeof this.props.onClick === 'function') this.props.onClick();
        if (!this.props.noActionSheet && !this.state.isShowActionSheet) this.setState({
            isShowActionSheet: true
        })
    }

    onCloseActionSheet = () => {
        this.setState({
            isShowActionSheet: false
        })
    }
}




export class FbItemImageText extends FbItem {
    className = 'fb-item-img-text'

    renderContent() {
        if (this.props.isStatic) {
            return this.renderStatic();
        }

        return <div>
            <div className="textarea-wrap">
                <textarea value={this.props.text} onChange={this.onChangeTextarea} placeholder={this.props.placeholder}></textarea>
            </div>
            <div className="imgs-wrap">
                <div className="fb-item-title">
                    {this.props.imageTitle}
                </div>
                <div className="imgs">
                    <UploadImage 
                        className="img on-log"
                        onUpload={this.props.onUploadImage}
                        attrs={{'data-log-region': 'btn-upload-image'}}
                    >
                        {items => items.map((item, index) => {
                            return <div key={index}
                                className="img"
                            >
                                <div className="entity" onClick={() => this.onClickImg(item, items)}>
                                {
                                    item.localId
                                        ?
                                        <WrapImg src={item.localId}/>
                                        :
                                        item.content
                                            ?
                                            <Pitcure className="img-cont" src={`${item.content}?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200`} />
                                            :
                                            false
                                }
                                {
                                    item.status === 'pending'
                                        ?
                                        <div className="status">
                                            上传中<span className="co-loading-ellipsis"></span>
                                        </div>
                                        :
                                        item.status === 'success'
                                            ?
                                            false
                                            :
                                            <div className="status">
                                                等待上传
                                            </div>
                                }
                                </div>
                            </div>
                        })}
                        {''}
                    </UploadImage>
                </div>
            </div>
        </div>
    }

    renderStatic() {
        return <div className="static-cont">
            <div className="text">{this.props.text}</div>
            {
                !!(this.props.images && this.props.images.length) &&
                <div className="imgs">
                {
                    this.props.images.map((item, index) => {
                        return <div key={index}
                            className="img"
                        >
                            <div className="entity" onClick={() => this.onClickImg(item, this.props.images)}>
                            {
                                item.content
                                ?
                                <Pitcure className="img-cont" src={`${item.content}?x-oss-process=image/resize,m_fill,limit_0,h_150,w_150`} />
                                :
                                item.localId
                                    ?
                                    <WrapImg src={item.localId}/>
                                    :
                                    false
                            }
                            </div>
                        </div>
                    })
                }
                </div>
            }
            {
                !!this.props.time &&
                <div className="time">{formatDate(this.props.time, 'yyyy-MM-dd hh:mm:ss')}</div>
            }
        </div>
    }

    onChangeTextarea = e => {
        const text = e.target.value;
        this.props.onChangeText && this.props.onChangeText(text);
    }

    onClickImg = (img, imgs) => {
        const url = img.content || img.localId;
        const urls = imgs.map(img => img.content || img.localId);
        window.showImageViewer(url, urls);
    }
}


class WrapImg extends React.PureComponent {
    state = {
        style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            WebkitTransform: 'translate3d(-50%, -50%, 0)',
            transform: 'translate3d(-50%, -50%, 0)',
        }
    }

    render() {
        return <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <img src={this.props.src} onLoad={this.onLoad} style={this.state.style}/>
        </div>
    }

    onLoad = e => {
        const target = e.target;
        if (target.naturalWidth >= target.naturalHeight) {
            this.setStyle({
                height: '100%'
            })
        } else {{
            this.setStyle({
                width: '100%'
            })
        }}
    }

    setStyle = obj => {
        this.setState({
            style: {
                ...this.state.style,
                ...obj,
            }
        })
    }
}