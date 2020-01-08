import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, locationTo } from 'components/util';

@autobind
class BuyHistory extends Component {
  state = {
  }
 
  componentDidMount(){
  }
  
  render() {
    return (
      <Page title="3323" className="buy-history-box">
        飒飒===121212
      </Page>
    );
  }
}

const mapStateToProps = function(state) {
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(BuyHistory);