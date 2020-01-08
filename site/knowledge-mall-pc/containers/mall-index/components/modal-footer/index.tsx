import * as React from 'react';
import styles from './style.scss'

export interface ModalFooterProps {
    nextStep: () => void;
    pass: () => void
}

export default class ModalFooter extends React.Component<ModalFooterProps, any> {

    state = {
        
    }

    render() {

        return (
            <div className={styles.modalFooter}>
                <div className={styles.nextStep} onClick={this.props.nextStep}>下一步</div>
                <div className={styles.pass} onClick={this.props.pass}>下次再填</div>
            </div>
        );
    }
}
