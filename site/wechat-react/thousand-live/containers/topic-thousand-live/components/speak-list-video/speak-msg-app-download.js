import React, { Component } from 'react';
import SpeakMsgContainer from './speak-msg-container';
import { locationTo } from 'components/util';

class AppDownload extends Component {

    render() {

        return (
            <SpeakMsgContainer
                {...this.props}
                hideFavor = {true}
            >
                <div className='download-app-msg on-log'
                    onClick={() => locationTo('http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1390837634884')}
                    data-log-region="speak-list"
                    data-log-pos="app-download"
                >
                    <header>
                        <img src={require('../../img/listens.png')} alt=""/>
                        <span className='download-info'>打开千聊APP，轻松听课</span>
                    </header>
    
                    <footer>
    
                        <span className='download-text'>立即下载</span>
    
                        <img className='enter-app-arrow' src={require('../../img/enter-app-arrow.png')} alt=""/>
                    </footer>
                </div>
                
            </SpeakMsgContainer>
        );
    }
}

export default AppDownload;