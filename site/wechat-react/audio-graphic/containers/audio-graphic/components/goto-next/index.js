import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import { locationTo, formatMoney } from 'components/util';

class GotoNext extends Component {
    render() {
        return (
            <MiddleDialog
            show={this.props.show}
            theme='empty'
            bghide
            close={true}
            titleTheme={'white'}
            className="pay-for-topic-dialog"
            onClose={this.props.onClose}
        >
            <div className='main'>
                <div className="msg">
                     音频收听已结束   
                </div>
                <div className="btn-pay-channel" onClick={()=>{locationTo(`/topic/details-audio-graphic?topicId=${this.props.nextTopicId}${this.props.shareKey?"&shareKey="+this.props.shareKey:""}`)}}>继续收听下一节</div>    
                    
            </div>
        </MiddleDialog>
            
        );
    }
}

GotoNext.propTypes = {

};

export default GotoNext;