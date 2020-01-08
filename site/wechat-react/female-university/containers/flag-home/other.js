import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad'; 
import FhHeadOther from './components/fh-head-other'; 
import FhFlag from './components/fh-flag';
import FhList from './components/fh-list'; 
import { universityFlag,flagHelpList,universityFlagCardList, doPayForCard } from '../../actions/flag';
import { getUrlParams } from 'components/url-utils';
import { formatMoney, locationTo ,formatDate} from 'components/util';  
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit'; 
  
@autobind
class FlagHome extends Component {
    state = {
        universityFlagData:{},
        flagHelpListData:{},
        shareId:'', 
        upNumber:0,
        isShowProcess:false, 
        isShowType:"", 
        isShowRecard:false,  
        showCashIndex:2,
        recardDate:'',
        showCashType:'',
        isShowFail: false,
        isShowWithdraw:false,
    }   
    componentDidMount() {
       this.initData();
    }
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    //初始化数据
    async initData() {
        const { flagUserId } = this.props.location.query
        const universityFlagData = await universityFlag({
            flagUserId
        }); 
        const flagHelpListData = await flagHelpList({
            flagUserId
        });
        const { flagCardList = [] } = await universityFlagCardList({
            flagUserId
        });
        this.setState({
            universityFlagData,
            flagHelpListData,
            flagCardList
        } )    
         
    }  

    render(){
        const { universityFlagData,
            flagHelpListData,
            flagCardList,
            shareId, 
             isShowProcess,
             showCashIndex,
             isShowRecard,
             processUrl,
             recardDate,
             showCashType,
             isShowFail,
             upNumber,
             isShowType,
             isShowWithdraw } = this.state;
        return (
            <Page title="TA的小目标" className="flag-home-page flag-other">
                <ScrollToLoad
                    className={`fh-scroll-box ${(isShowProcess||isShowFail||!!showCashType||isShowRecard||isShowWithdraw) ? 'pointer-events-none':''}`}
                    toBottomHeight={300}
                    disable={true}
                    notShowLoaded={true}
                    >
                    <FhHeadOther    
                        {...universityFlagData}
                        shareId={shareId}/>
                    <div className="fh-main">  
                        <FhFlag {...universityFlagData} isOther={true}/>
                        <FhList 
                            isOther={true}
                            {...universityFlagData}
                            flagList={flagHelpListData?.data?.flagHelpList} 
                            flagCardList={flagCardList} 
                            shareDay={this.shareDay}/>
                    </div>
                </ScrollToLoad>
                  
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
     
});

const mapActionToProps = {
    doPayForCard,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagHome);