import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import styles from './style.scss'

import CommonHeader from '../../components/common-header';
import ReprintTab from './components/reprint-tab'
import PromoteTab from './components/promote-tab'

import OrderIncome from './components/order-income';

export interface MallManageProps {
    location?: any;
}

@autobind
class MallManage extends React.Component<MallManageProps & any, any> {
    
    state={
        activeTab: 'reprint',
    }

    get liveId() {
        return this.props.location.query.selectedLiveId || this.props.liveId
    }

    locationTo(url: string) {
        this.props.router.push(url)
    }

    changeTab(key) {
        this.setState({ activeTab: key })
    }

    render() {
        const liveId = this.props.location.query.selectedLiveId
        const { activeTab } = this.state

        return (
            <div>
                <CommonHeader curTabId="manage"/>
                <OrderIncome />
                <div className={styles["panel"]}>
                    <Tabs tabBarStyle={{ margin: 0 }} activeKey={activeTab} onChange={this.changeTab}>
                        <TabPane tab='转载课程' key='reprint' >
                            <ReprintTab liveId={this.liveId} locationTo={this.locationTo}/>
                        </TabPane>
                        <TabPane tab='推广订单' key='promote' >
                            <PromoteTab liveId={this.liveId} locationTo={this.locationTo} changeTab={this.changeTab}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapState2Props = state => {
    return {
        liveId: state.common.liveInfo.liveId
    };
}

export default connect(mapState2Props)(MallManage);
