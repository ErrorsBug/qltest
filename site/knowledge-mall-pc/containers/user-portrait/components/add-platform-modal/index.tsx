import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';

import Modal from '../../../../components/modal';

import { YorN } from '../../../../models/course.model';

import { Input, Button, message } from 'antd'

import styles from './style.scss';

import { setPlatformModalDisplay, addActivePlatform, updateActivePlatforms, destroyActivePlatform } from '../../../../actions/portrait';

export interface props {
    show: YorN;
    setPlatformModalDisplay: (params: string) => void;
    addActivePlatform: (params: object) => void;
    updateActivePlatforms: (params: any[]) => void;
    destroyActivePlatform: () => void;
    activePlatforms: any[];
    platformToBeUpdatedIndex: number;
}

const { TextArea } = Input;

@autobind
class AddPlatformModal extends React.Component<props, any> {

    state = {
        // 平台名称
        platformName: '',
        // 平台链接
        platformLink: '',
    }

    data = {
        // 匹配普遍意义上的URL的正则
        urlPattern: /^https?:\/\/.+?$/i,
    }

    closeModal() {
        this.props.setPlatformModalDisplay('N');
        this.props.destroyActivePlatform();
    }

    updateOrAddPlatform() {
        const { platformName, platformLink } = this.state;
        if (!platformName || !platformLink) {
            message.error('平台名称和主页链接都要填写哦~');
            return false;
        }
        if (platformName.length > 10) {
            message.error('平台名称最多填写10个字符哦~');
            return false;
        }
        if (!this.data.urlPattern.test(platformLink)) {
            message.error('请填写一个合理的主页链接哦~');
            return false;
        }
        const index = this.props.platformToBeUpdatedIndex;
        if (index > -1) {
            // 更改平台信息
            const activePlatforms = [...this.props.activePlatforms];
            activePlatforms.splice(index, 1, {
                platform: platformName,
                platformIndex: platformLink
            });
            this.props.updateActivePlatforms(activePlatforms);
        } else {
            // 添加平台
            this.props.addActivePlatform({
                platform: platformName,
                platformIndex: platformLink
            });
        }
        this.closeModal();
    }

    handleNameInput(e) {
        this.setState({
            platformName: e.target.value.trim()
        });
    }

    handleLinkInput(e) {
        this.setState({
            platformLink: e.target.value.trim()
        });
    }

    initFormContent(props) {
        let index = props.platformToBeUpdatedIndex;
        if (index > -1) {
            const platform = this.props.activePlatforms[index];
            this.setState({
                platformName: platform.platform,
                platformLink: platform.platformIndex
            });
        } else {
            this.setState({
                platformName: '',
                platformLink: ''
            });
        }
    }

    componentDidMount() {
        this.initFormContent(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.initFormContent(nextProps);
    }

    render() {
        return (
            <Modal show={this.props.show} onClose={this.closeModal}>
                <section className={styles.addPlatformContainer}>
                    <header className={styles.modalHeader}>添加证明<em onClick={this.closeModal}></em></header>
                    <div className={styles.modalMain}>
                        <div className={styles.row}>
                            <span>平台名称:</span>
                            <Input value={this.state.platformName} onChange={this.handleNameInput} placeholder="如：新浪微博" />
                        </div>
                        <div className={classNames({
                            [styles.row]: true,
                            [styles.platformLink]: true,
                        })}>
                            <span>主页链接</span>
                            <TextArea value={this.state.platformLink} onChange={this.handleLinkInput} placeholder="如： https://weibo.com/qianliao?topnav=1&wvr=6&topsug=1" />
                        </div>
                    </div>
                    <footer className={styles.modalFooter}>
                        <Button type="primary" onClick={this.updateOrAddPlatform}>确定</Button>
                    </footer>
                </section>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    activePlatforms: state.portrait.activePlatforms,
    platformToBeUpdatedIndex: state.portrait.platformToBeUpdatedIndex,
});

const mapActionToProps = {  
    setPlatformModalDisplay,
    addActivePlatform,
    updateActivePlatforms,
    destroyActivePlatform,
};

export default connect(mapStateToProps, mapActionToProps)(AddPlatformModal);