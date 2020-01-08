import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import PressHoc from 'components/press-hoc';
import { getUrlParams } from 'components/url-utils';
import { getSaleQr } from '../../actions/home'

@autobind
class ActivityUrl extends Component {
    state = {
        url: ""
    }
    get campId(){ 
        return getUrlParams('campId', '')
    }
    async componentDidMount() { 
        this.initData();
    }

    async initData() {
        const { qr } = await getSaleQr({
            resourceId: this.campId,
            resourceType: 'ufw_camp'
        });
        this.setState({
            url: qr
        })
    }
    render(){
        const { url } = this.state;
        return (
            <Page title={ '千聊女子大学' } className="uni-activity-url">
                <section className="scroll-content-container">
                    <PressHoc  className="uni-activity-img" region="uni-activity-img">
                        <img src={ url } />
                    </PressHoc>
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ActivityUrl);