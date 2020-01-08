import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from 'components/util'
import { imgUrlFormat } from 'components/util';

class JoinerLiist extends Component {
    constructor(props) {
        super(props)
        this.toggleOpera = this.toggleOpera.bind(this)
    }
    state = {
        tempList: [],
        toggleOpen: false,
    }
    changeList() {
        this.setState({
            tempList: this.state.toggleOpen ? this.props.list : this.props.list.slice(0, 2)
        })
    }
    toggleOpera() {
        this.setState({
            toggleOpen: !this.state.toggleOpen 
        }, () => {
            this.changeList()
        })
    }
    componentDidMount() {
        this.changeList()
    }
    render() {
        let { liveRole, list, groupType } = this.props
        return (
            <section className='joiner-list-container'>
                <header>
                    <span className='verticle-line'></span>
                    拼课详情
                </header>
                <div className="joiner-tip">
                {
                    liveRole == 'manager' || liveRole == 'creater'?
                    '拼课成功直播间才能获得课程收入，失败则原路退款至账户中'
                    :'拼课成功才可进入听课，失败则原路退款至账户中'
                }
                </div>
                <ul className='joiner-list'>
                    {
                        this.state.tempList.map((item, index) => (
                            <Item key={`joiner-item-${index}`} {...item} index={index} liveRole={liveRole} groupType={groupType}/>
                        ))
                    }
                </ul>
                <div className="toggle-opera" onClick={this.toggleOpera}>
                    {
                        list.length > 2 ?
                            <div>{this.state.toggleOpen ? '收起' : '查看全部' }<span className={`arrow ${this.state.toggleOpen ? 'arrow-down' : 'arrow-up'}`}></span></div>
                        : null
                    }
                </div>
            </section>
        );
    }
}

const Item = props => {
    const time = formatDate(props.createTime, 'yyyy-MM-dd hh:mm')
    return (
        <li>
            <img src={imgUrlFormat(props.headUrl || "http://img.qlchat.com/qlLive/liveCommon/normalLogo.png", '@42w_42h_1e_1c_2o')} />
            <div className="info">
                <div className='joiner-name'>
                    {
                        props.index === 0 && <b className="badge">团长</b>
                    }
                    {props.userName}

                </div>
                {
                    !props.robot &&
                    <div className="date">
                        <span className='time'>{time}</span>
                        <span className='status'>{
                            props.index === 0 ? '开团' : '参团'
                        }</span>
                    </div>
                }
               
            </div>
            {/* 只有管理员 创建者才展示 */}
            <div className="dis-name">
                {
                    props.liveRole?
                        props.index === 0 && props.groupType == 'free'?
                        '团长免费'
                        : props.money && `￥${props.money}`
                    :null
                }
            </div>
        </li>
    );
}

JoinerLiist.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        headUrl: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        createTime: PropTypes.number.isRequired,
    })).isRequired,
    groupType: PropTypes.string.isRequired
};


export default JoinerLiist;