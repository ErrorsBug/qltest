import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Form, Input, Select, Icon } from 'antd';

import {
    updateWechatInfo,
} from '../../../../actions/portrait';

import styles from './style.scss';

const FormItem = Form.Item;

const Option = Select.Option;

export interface props {
    wechatInfo: any;
    updateWechatInfo?: (params: object) => void;
}

@autobind
class WechatInfo extends React.Component<props, any> {

    state = {
        showWechatAccountTip: false,
    }

    data = {
        intPattern: /^\d+?$/,
    }

    showTip() {
        this.setState({
            showWechatAccountTip: true
        })
    }

    hideTip() {
        this.setState({
            showWechatAccountTip: false
        })
    }

    handleFieldInput(e) {
        const fieldName = e.target.getAttribute('data-field');
        this.props.updateWechatInfo({
            [fieldName]: e.target.value.trim()
        });
    }

    handleFollowersInput(e) {
        // 粉丝数量只能输入整数
        const followers = e.target.value.trim();
        if (followers === '' || this.data.intPattern.test(followers)) {
            this.props.updateWechatInfo({ followers });
        }
    }

    handleCategorySelect(value) {
        this.props.updateWechatInfo({
            category: value
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const {
            name,
            account,
            followers,
            category,
            allCategories = [],
            contacts,
            phone
        } = this.props.wechatInfo;
        return (
            <section className={styles.wechatInfoContainer}>
                <h1 className={styles.headTip}>公众号信息</h1>
                <div>
                    <FormItem label="公众号名称" {...formItemLayout}>
                        <Input placeholder="请填写公众号名称" value={name} data-field="name" onChange={this.handleFieldInput} />
                    </FormItem>
                    <FormItem label="公众号微信号" {...formItemLayout}>
                        <Input placeholder="请填写公众号微信号" value={account} data-field="account" onChange={this.handleFieldInput} addonAfter={<Icon type="question-circle-o" onMouseOut={this.hideTip} onMouseOver={this.showTip}/>} />
                        {
                            this.state.showWechatAccountTip && <div className={styles.wechatAccountTip}><img alt="" src={require('./img/wechat_tip.png')} /></div>
                        }
                    </FormItem>
                    <FormItem label="公众号粉丝数" {...formItemLayout}>
                        <Input placeholder="请填写公众号粉丝数" value={followers} data-field="followers" onChange={this.handleFollowersInput} />
                    </FormItem>
                    <FormItem label="公众号分类" {...formItemLayout}>
                        <Select placeholder="请选择公众号分类" value={category || undefined} data-field="category" onChange={this.handleCategorySelect} className={styles.wechatCategories} style={{ width: '100%' }}>
                        {
                            allCategories.map((category, index) => {
                                return <Option value={category} key={index}>{category}</Option>
                            })
                        }
                        </Select>
                    </FormItem>
                    <FormItem label="联系人" {...formItemLayout}>
                        <Input placeholder="请填写联系人" value={contacts} data-field="contacts" onChange={this.handleFieldInput}/>
                    </FormItem>
                    <FormItem label="联系电话" {...formItemLayout}>
                        <Input placeholder="请填写联系电话" value={phone} data-field="phone" onChange={this.handleFieldInput}/>
                    </FormItem>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({});
const mapActionToProps = {
    updateWechatInfo,
};

export default connect(mapStateToProps, mapActionToProps)(WechatInfo);