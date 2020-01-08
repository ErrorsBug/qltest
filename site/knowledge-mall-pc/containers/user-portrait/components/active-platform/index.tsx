import * as React from 'react';
import { connect } from 'react-redux';
import {autobind } from 'core-decorators';
import classNames from 'classnames';

import { Button, Icon } from 'antd';

import styles from './style.scss';

import { setActivePlatform, setPlatformModalDisplay } from '../../../../actions/portrait';

export interface props {
    activePlatforms: any[];
    setActivePlatform: (params: number) => void;
    setPlatformModalDisplay: (params: string) => void;
}

@autobind
class ActivePlatform extends React.Component<props, any> {
    openUpdatePlatformModal(e) {
        const index = +e.target.getAttribute('data-index');
        this.props.setActivePlatform(index);
        this.props.setPlatformModalDisplay('Y');
    }

    openAddPlatformModal(){
        this.props.setPlatformModalDisplay('Y');
    }

    render() {
        const {
            activePlatforms = []
        } = this.props;
        return (
            <section className={styles.activePlatformContainer}>
                <h1 className={styles.headTip}>活跃平台</h1>
                <ul className={styles.platformList}>
                {
                    activePlatforms.map((platform, index) => {
                        return (
                            <li key={index} >
                                <span className={styles.platformName}>{platform.platform}</span>
                                <span className={styles.platformLink}>{platform.platformIndex}</span>
                                <span className={styles.updateButton} role="button" data-index={index} onClick={this.openUpdatePlatformModal}>修改</span>
                            </li>
                        )
                    })
                }
                </ul>
                <Button type="dashed" className={styles.addPlatformButton} onClick={this.openAddPlatformModal}><Icon type="plus" /><span>添加证明</span></Button>
            </section>
        )
    }
}

const mapStateToProps = state => ({});

const mapActionToProps = {
    setActivePlatform,
    setPlatformModalDisplay,
};

export default connect(mapStateToProps, mapActionToProps)(ActivePlatform);