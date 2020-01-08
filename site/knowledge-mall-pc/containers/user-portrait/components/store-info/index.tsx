import * as React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';

import styles from './style.scss';

export interface props {
    storeInfo: any;
}

class StoreInfo extends React.Component<props, any> {
    render() {
        const { name, version, followers } = this.props.storeInfo;
        return (
            <section className={styles.storeInfoContainer}>
                <h1 className={styles.headTip}>知识店铺信息</h1>
                <div className={styles.info}>
                    <div>
                        <span>店铺名称:</span>
                        <span>{name}</span>
                    </div>
                    <div>
                        <span>店铺版本:</span>
                        <span>{version}</span>
                        {
                            version === '基础版' && <Button className={styles.upgradeButton} type="primary" size="small" href="/wechat/page/live-studio/intro-nologin?type=h5" target="_blank">去升级</Button>
                        }
                    </div>
                    <div>
                        <span>关注人数:</span>
                        <span>{followers}</span>
                    </div>
                </div>
            </section>
        )
    }
} 

export default StoreInfo;