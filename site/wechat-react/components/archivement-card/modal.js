import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';

class ArchivementCardModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        archivementCardUrl: PropTypes.string.isRequired
    }

    render(){
        return (
            <div className="archivementcard-modal">
                <div className="archivementcard-wrap">
                    <div className="close-modal-wrap"><span className="icon-close-modal" onClick={
                        () => {
                            this.props.hideModal();
                        }
                    }/></div>
                    <div className="archivementcard-badge"></div>
                    <div className="archivementcard-text">恭喜，你已听完此次课程，<br/>已为你生成专属成就卡</div>
                    <div className="get-card-btn" onClick={() => {
                        locationTo(this.props.archivementCardUrl);
                    }}>获取成就卡</div>
                </div>
            </div>
        )
    }
}

export default ArchivementCardModal;