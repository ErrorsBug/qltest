import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators'
import ScrollToLoad from 'components/scrollToLoad';
import { locationTo, localStorageSPListAdd, localStorageSPListDel } from 'components/util';
import TopTabBar from 'components/learn-everyday-top-tab-bar';
import EmptyPage from 'components/empty-page';
import StudioItem from './components/studio-item';
import { request } from 'common_actions/common';
import ScrollHoc from './scroll-hoc'


function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {

}

@ScrollHoc({ url: '/api/wechat/transfer/baseApi/h5/live/listLastBrowseLive' })
@autobind
class LookStudio extends Component {
    
    render() {
        const { loadNext, isNoMore, isNoOne, dataList = [] } = this.props;
        return (
            <Page title="看过的直播间" className="lk-studio-box">
                <TopTabBar 
                    config = {[
                        {
                            name: '看过的课程',
                            href: '/wechat/page/mine/foot-print'
                        },
                        {
                            name: '看过的直播间',
                            href: '/wechat/page/mine/look-studio'
                        },
                    ]}
                    activeIndex = {1}
                />
                <ScrollToLoad 
                    loadNext={ loadNext }
                    noMore={ isNoMore }
                    noneOne={ isNoOne }
                    className='lk-studio-list'>
                    { dataList.map((item, index) => (
                        <StudioItem key={ index } { ...item } />
                    )) }
                </ScrollToLoad>
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(LookStudio);
