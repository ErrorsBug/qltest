/**
 * （会员专题活动页）通用专题活动页
 * @author jiajun.li
 * @date 20181113
 */

import '@babel/polyfill';
import PropTypes from 'prop-types';
import './style.scss';
import * as React from 'react';
import { render, createPortal } from 'react-dom';
import { Link } from 'react-router'

// import * as regeneratorRuntime from '../'


import Page from '../../components/page';
import Picture from 'ql-react-picture';

import * as ui from '../../utils/ui';
import api from '../../utils/api';
import { share } from '../../utils/wx-utils';
import { getUrlParams } from '../../utils/url-utils';
import { locationTo, formatMoney } from '../../utils/util';



class Btns extends React.PureComponent {
    render() {
        const { url, txt, status, msg="活动已失效" ,color = '-webkit-linear-gradient(top, #FFAE7A, #FF7D75)' } = this.props;
        return createPortal(
            <div className="activity-btn">
                <div className=" activity-link on-log" 
                    data-log-region="activity-teacher"
                    data-log-pos="0"
                    style={{ background: color }}
                    onClick={ () => { 
                        if(status){
                            locationTo(url)
                        }else{
                            ui.toast(msg);
                        }} }
                    >{ txt || "戳此进入课程" }</div>
            </div>,
            document.getElementById('app')
        )
    }
}

const styleList = [];

class CommonActivity extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    }

	static propTypes = {
		context: PropTypes.object,
	};

	static defaultProps = {
		context: {
			insertCss: (...styles) => {
				styles.forEach(style => {const css = style._getCss();
					if(styleList.indexOf(css) < 0){
						styleList.push(css);
						const styleDom = document.createElement('style');
						styleDom.type = 'text/css';
						style._getCss && (styleDom.innerHTML = style._getCss());
						document.querySelector('head').appendChild(styleDom);
					}
				})
			},
		},
	};

	static childContextTypes = {
		insertCss: PropTypes.func.isRequired,
	};

	getChildContext() {
		return this.props.context;
	}

    state = {
        conf: {

        }
    }

    componentDidMount() {
        this.urlParams = getUrlParams();
        this.getConf();
    }

    render () {
        const conf = this.state.conf;
        const modules = conf.modules || [];
        return (
            <Page title={conf.title}>
                <div className="common-activity" style={{backgroundColor: conf.backgroundColor}}>

                    {
                        conf.headImage &&
                        <Picture className="banner-img" src={conf.headImage} />
                    }
                    
                    {
                        modules.map((item, index) => {
                            return <Module key={index}
                                conf={conf}
                                {...item}
                            />
                        })
                    }

                    {
                        conf.footerImage &&
                        <Picture className="banner-img" src={conf.footerImage} />
                    }

                    {
                        !!conf.msg &&
                        <div className="page-mask" onClick={() => ui.toast(conf.msg)}></div>
                    }
                </div>
                { Object.is(conf.type, 'ip') && <Btns txt={ conf.ipBtnText } msg={ conf.msg } status={ Object.is(conf.status, 'Y') } color={ conf.ipBtnColor } url={ conf.ipBtnUrl } /> }
                
            </Page>
        )
    }

    getConf = () => {
        api('/api/wechat/transfer/h5/activity/memberAct', {
            method: 'POST',
            body: {
                activityCode: this.urlParams.albumId
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            const conf = {
                ...this.state.conf,
                ...res.data,
            }

            // 配置默认值
            conf.title || (conf.title = '千聊专题活动');
            conf.backgroundColor || (conf.backgroundColor = '#ffdedd');
            conf.btnText || (conf.btnText = '立即领券');

            this.setState({
                conf
            }, () => {
                this.initShare();
            });

        }).catch(err => {
            console.error(err);
            ui.toast('获取活动详情失败：' + err.message);
        })
    }

    initShare = () => {
        const conf = {
            title: this.state.conf.title,
            desc: this.state.conf.shareText,
            shareUrl: location.href,
            imgUrl: this.state.conf.shareImage,
        }
        share(conf);
    }
}




class Module extends React.PureComponent {
    render() {
        const { conf, courseList = [] } = this.props;

        return (
            <div>
                {
                    !!this.props.headImage &&
                    <Picture className="banner-img" src={this.props.headImage} />
                }
                <div className="course-list">
                    {
                        courseList.map((item, index) => {
                            return <CourseItem key={index} conf={conf} data={item}/>
                        })
                    }
                </div>
            </div>
        )
    }
}




class CourseItem extends React.PureComponent {
    render() {
        const { conf, data } = this.props;

        const headImg = conf.style === 'style2'
            ? `${data.headImage}@300w_186h_1e_1c_2o`
            : `${data.headImage}@630w_394h_1e_1c_2o`;

        return (
            <div className={`course-item ${conf.style}`}>
                <div className="entity">
                    <div className="head-img">
                        <Picture src={headImg} />
                    </div>
                    <div className="info">
                        <div className="name">{data.name}</div>
                        { !Object.is(conf.type, 'ip') && <div className="price">原价：￥{formatMoney(data.money)}</div>}
                        <div className="btn-get"
                            style={{backgroundColor: conf.btnColor}}
                            onClick={this.onClick}
                        >{conf.btnText}</div>
                    </div>
                </div>
            </div>
        )
    }

    onClick = async () => {
        const { conf, data } = this.props;

        if (conf.onlyMember === 'Y') {
            const isQLVip = await api('/api/wechat/transfer/h5/member/memberInfo', {
                method: 'POST'
            }).then(res => {
                if (res && res.data && res.data.level >= 1) return true;
            })
            if (isQLVip) {
                locationTo(data.url);
            } else {
                ui.toast('会员才能领券，还可享受8折', 2000);
                setTimeout(() => {
                    locationTo('/wechat/page/membership-center');
                }, 2000);
            }
        } else {
            locationTo(data.url);
        }
    }
}











render(<CommonActivity />, document.getElementById('app'));