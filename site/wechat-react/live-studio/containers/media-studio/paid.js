import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { formatDate, locationTo } from '../../../components/util';
import { getQr } from '../../actions/common'

class MediaStudioPaid extends Component {
    state = {
        qrcodeUrl: '',
    }

    componentDidMount = async () => {
        if (this.props.showQrcode) {
            const result = await this.props.getQr({
                channel: 'selfMediaBuy',
                showQl: 'Y',
                liveId: this.props.liveId
            });
            this.setState({
                qrcodeUrl: result.data && result.data.qrUrl
            });
        }
    }

    render(){
        const {liveName, liveAdminStart, liveAdminOverDue, showQrcode} = this.props;
        const qrcodeUrl = '';
        return (
            <Page title="千聊" className="media-studio-container">
                <div className="success-container">
                    <section className="result">
                        <div className="mention">
                            <h1>
                                <span className="icon-success"></span>
                                支付成功
                            </h1>
                            <p>恭喜您已成功开通自媒体版直播间</p>
                        </div>

                        <ul className="info">
                            <li>
                                <span className='label'>直播间:</span>
                                <span className='content'>{liveName}</span>
                            </li>

                            <li>
                                <span className='label'>有效期:</span>
                                <span className='content'>
                                    {formatDate(liveAdminStart,'yyyy年MM月dd日')} 至 {formatDate(liveAdminOverDue, 'yyyy年MM月dd日')}
                                </span>
                            </li>
                        </ul>
                    </section>

                    {
                        showQrcode ?
                        <section className="guide">
                            <div className="shop">
                                    
                                <img
                                    className="qrcode"
                                    src={this.state.qrcodeUrl}
                                />
                        
                                <div className="forgive-hat"></div>
                            </div>
                        
                            <p className="tips">
                                长按关注我们，马上查看您的知识店铺！
                            </p>
                        </section>
                        :
                        <div className="guide">
                            <button type="button" className="gotoAdmin" onClick={() => {
                                locationTo('/wechat/page/backstage');
                            }}>返回管理后台</button>
                        </div>
                    }                                
                                    
                </div>
            </Page>
        )
    }
}

function mapStateToProps(state){
    return {
        liveId: state.common.liveId,
        liveName: state.common.liveName,
        liveAdminStart: state.common.liveAdminStart,
        liveAdminOverDue: state.common.liveAdminOverDue,
        showQrcode: !state.common.subscribe.subscribe
    }
}

const mapDispatchToProps = {
    getQr
};



export default connect(mapStateToProps, mapDispatchToProps)(MediaStudioPaid);