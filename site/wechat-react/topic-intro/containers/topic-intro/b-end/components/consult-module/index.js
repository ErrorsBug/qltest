import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { getVal } from 'components/util';
import ConsultItem from '../consult-dialog/consult-item'

@autobind
class ConsultModule extends Component {
    render() {
        if (this.props.consultList.length > 0) {
            return (
                <div className='topic-consult-module'
                    ref={this.props.consultRef}
                >
                    <header className='consult-header'>
                        精选留言 <span className='consult-count'>{ this.props.consultNum }</span>
                    </header>
                    <ConsultItem
                        { ...this.props.consultList[0]}
                        consultPraise = {this.props.consultPraise}
                    />
                    {
                        this.props.consultList.length > 1 &&
                        <div className="btn-more-consult" onClick={this.props.showConsult}>查看更多精选留言</div>
                    }

                </div>
            );
            
        } else {
            return null;
        }
    }
}

function mapStateToProps (state) {
    return {
        consultNum: getVal(state, 'topicIntro.consultNum', 0),
        consultList: getVal(state, 'topicIntro.consultList', []),
    }
}
const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(ConsultModule);