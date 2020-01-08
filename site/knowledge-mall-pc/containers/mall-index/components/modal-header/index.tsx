import * as React from 'react';
import styles from './style.scss'

export interface ModalHeaderProps {
}

export default class ModalHeader extends React.Component<ModalHeaderProps, any> {

    state = {
        
    }

    render() {

        return (
            <div className={styles.modalHeader}>
                <div className={styles.main}>
                    我的画像
                </div>
                <div className={styles.subTitle}>
                    请完善信息，真实的画像有助于您获得更精准更优质的服务和合作
                </div>
            </div>
        );
    }
}
