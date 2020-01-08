import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';

import CampLive from '../camp-live';


class DetailIntro extends Component {

    render() {
        return (
                <div className='detail-intro-container'>
                    <CampLive />
                    <div className="intro-info">
                        <div className="title"><span className="block"></span>打卡介绍</div>
                        {
                            this.props.introList.map((intro) => {
                                const { content, id, type } = intro;

                                switch(type) {
                                    case 'text': return <div key={id} className="intro-text"><code>{content}</code></div>
                                    case 'image': return <img key={id} className="image common-bg-img" src={content} alt="介绍图片"></img>
                                }

                            })
                        }
                        {
                            this.props.introList && this.props.introList.length == 0 ?
                            <div className="blank-intro">暂无介绍~</div> :
                            null
                        }
                        {
                            this.props.groupComponent && 
                            <div style={{padding: '30px 0 0px'}}>
                                {this.props.groupComponent}
                            </div>
                        }
                    </div>
                </div>
        );
    }
}

DetailIntro.propTypes = {

};

const mapStateToProps = (state) => ({
    introList: getVal(state, 'campIntroModel.introList', []),
});

export default connect(mapStateToProps)(DetailIntro)