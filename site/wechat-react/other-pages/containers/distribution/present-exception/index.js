const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';

class DistributionPresentException extends Component {
    state = {
        type: '',
    }

    componentDidMount() {
        this.initPage();
    }

    initPage(){
        this.setState({
            type:this.props.params.type
        })
    }

    render() {
        const {
            params: {
                pageType
            },
            location: {
                query: {
                    type,
                    id 
                }
            }
        } = this.props;

        let renderText = '';
        let redirectUrl = '';
        let businessName = '';

        switch (pageType) {
            case 'frozen':
                renderText  = '推广资格已经被创建者冻结';
                break;
            case 'deleted':
                renderText  = '推广资格已经被创建者删除';
                break;
            case 'received':
                renderText  = '推广资格已经被领取完';
                break;
            default:
                renderText = '你已领取过推广资格';
                break;
        }

        switch (type) {
            case 'channel':
                businessName = '系列课';
                redirectUrl = 'live/channel/channelPage/'+ id +'.htm';
                break;
            case 'topic':
                businessName = '话题';
                redirectUrl = 'topic/'+ id + '.htm';
                break;
            default:
                businessName = '直播间';
                redirectUrl = 'live/'+ id + '.htm';
                break;
        }

        return (
            <Page title='课代表专属页' className='distribution-none'>
                <div >
                    <div className="distribution-text"><p>{renderText}</p></div>
                    <a href={`/wechat/page/${redirectUrl}`} className="btn-jump-current">跳转到当前{businessName}</a>
                </div>
             </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(DistributionPresentException);
