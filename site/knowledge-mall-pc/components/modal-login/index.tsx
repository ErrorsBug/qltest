import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal';
import LoginQr from '../login-qr';
import { setLoginModalShow } from "../../actions/common";
import { YorN } from '../../models/course.model';
import { autobind } from 'core-decorators';


interface setLoginModalShow {
    (show: YorN): void;
}

export interface ModalLoginProps {
    setLoginModalShow: setLoginModalShow;
    showLoginModal: YorN;
}

@autobind
class ModalLogin extends React.Component<ModalLoginProps, any> {

    closeModal() {
        this.props.setLoginModalShow('N');
    }

    render() {
        return (
            <Modal 
                show={this.props.showLoginModal}
                onClose={this.closeModal}
            >
                <LoginQr />
            </Modal>
        );
    }
}

const mapState2Props = state => {
    return {
        showLoginModal: state.common.modal.showLoginModal
    };
}

const mapActionToProps = {
    setLoginModalShow
}

export default connect(mapState2Props, mapActionToProps)(ModalLogin);
