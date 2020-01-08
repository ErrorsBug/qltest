import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';

class ArchivementCardBtn extends Component {
    static propTypes = {
        archivementCardUrl: PropTypes.string.isRequired
    }

    render(){
        return (
            <div className="archivementcard-btn on-log"
                 onClick={() => {
                     locationTo(this.props.archivementCardUrl);
                 }}
                 data-log-name="成就卡"
                 data-log-region="archivementcard-btn"
            ></div>
        )
    }
}

export default ArchivementCardBtn;