import React, { Component, Fragment } from 'react'
import PortalCom from '../portal-com'
import { autobind } from 'core-decorators'
import ImgUpload from '../img-upload'
import Picture from 'ql-react-picture'
import { isWeixin, isPc } from 'components/envi'
import classnames from 'classnames'
import { addIdea, getTopicList } from '../../actions/community';
import ScrollToLoad from 'components/scrollToLoad'

@autobind
export default class extends Component {

    componentDidMount() { 
    }
 
    render() {
        const { id,imgUrl,name,userNum,ideaNum,isLink,icon,region } = this.props;
        return (
            <Fragment>
                <div className="un-topic-item un-topic-hot on-visible on-log" 
                    data-log-name={name}
                    data-log-region={region||'un-community-topic-item'}
                    data-log-pos={id || '0' }  
                    onClick={ () => this.props.handleSelectTopic() }>
                    <div className="un-topic-pic">
                        {
                            icon=='hot'&&<img src="https://img.qlchat.com/qlLive/business/8I5SH3NE-A9SP-Z5B9-1569578455446-XSOQPBFFV2BW.png"/>
                        }
                        
                        {
                            icon=='new'&&<img src="https://img.qlchat.com/qlLive/business/2SFILI8T-N3F1-GXQ6-1569737401017-1KRC9LB2UARZ.png"/>
                        }
                    </div>
                    <div className="un-topic-info">
                        <div>
                            <div>
                                <h4>#{ name }#</h4>
                                <p><span>{ userNum }次互动</span><span>{ ideaNum }条想法</span></p>
                            </div>
                        </div>
                    </div>
                    {
                        isLink&&
                        <div className="is-link">进入 <i className="iconfont iconxiaojiantou"></i></div>
                    }
                </div>
            </Fragment>
        )
    }
}

