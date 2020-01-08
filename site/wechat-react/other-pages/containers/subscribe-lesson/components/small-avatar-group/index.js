import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    imgUrlFormat,
} from 'components/util';

class SmallAvatarGroup extends Component {
    state = {
        avatarsDOM: [],
        describution: '',
        acount: 0,
        containerClass: [],
        acountClass: [],
        descClass: [],
        avatarClass: [],
        arrowClass: [],
    }
    static propTypes = {
        // 头像数组
        avatars: PropTypes.array,

        //以下不传表示不需要该模块
        // 描述
        describution: PropTypes.string,
        // 人数
        acount: PropTypes.number,

        // 样式类
        // 包裹
        containerClass: PropTypes.array,
        // 头像
        avatarClass: PropTypes.array,
        // 人数
        acountClass: PropTypes.array,
        // 描述
        descClass: PropTypes.array,
        // 箭头
        arrowClass: PropTypes.array,
    }
    componentWillMount() {
        let _this = this;
        let avatarsDOM = this.props.avatars.map(function(avatar, index) {
            if(index<4){
                return (
                    <div className={classnames("avatar", ..._this.state.avatarClass)} key={`small-avatar-${index}`}>
                        <img src={imgUrlFormat(avatar,"@62w_62h_1e_1c_2o")} />
                    </div>
                );
            }else{
                return null;
            }
            
        });
        let {
            describution,
            acount,
            containerClass,
            acountClass,
            descClass,
            avatarClass,
            arrowClass
        } = this.props;
        if (!containerClass) {
            containerClass = [];
        }
        if (!acountClass) {
            acountClass = [];
        }
        if (!descClass) {
            descClass = [];
        }
        if (!avatarClass) {
            avatarClass = [];
        }
        if (!arrowClass) {
            arrowClass = [];
        }
        
        this.setState({
            avatarsDOM,
            describution,
            acount,
            containerClass,
            acountClass,
            descClass,
            avatarClass,
            arrowClass
        });
    }
    componentDidMount() {
        if (!this.state.describution) {
            this.refs.desc.style.display = 'none';
        }
        if (!this.state.acount) {
            this.refs.acount.style.display = 'none';
        }
    }
    render() {
        return (
            <section className={classnames("small-ag-group-container", ...this.state.containerClass)}>
                <div className={classnames("avatars")}>
                    {this.state.avatarsDOM}
                </div>
                <div ref="arrow" className={classnames("arrow icon_enter", ...this.state.arrowClass)}></div>
                <div ref="desc" className={classnames("desc", ...this.state.descClass)}>{this.state.describution}</div>
                <div ref="acount" className={classnames("acount", ...this.state.acountClass)}>{this.state.acount}人</div>           
            </section>
        );
    }
}

export default SmallAvatarGroup;