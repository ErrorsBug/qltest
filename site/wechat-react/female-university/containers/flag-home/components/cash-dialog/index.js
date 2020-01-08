import React, { PureComponent,Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'
import { formatMoney, locationTo ,formatDate} from 'components/util'; 
import {ShowLink,ShowImg}   from '../../../../components/tip-share-dialog' 

export default class extends PureComponent{
    state={
        on:0
    }
    
    componentDidMount = () => {
        this.props.on&&this.setState({
            on:this.props.on
        })
    };
    componentDidUpdate(prevProps, prevState) { 
    }
    
    componentWillReceiveProps(nextProps) {
        
    }
    onChange=(i)=>{
        if(this.props.isQlchat){
            this.props.close()
            this.props.initMinCards()
        }else{
            this.setState({
                on:i
            })
        } 
        
    }
    close= () => { 
        this.props.close()
    }
    render() {
        const { isShow, showCashType,money,helpNum,upNumber} = this.props;
        const { on } = this.state
        return (
            <Fragment>
                {
                    isShow&&(on==0? <ShowLink /> :on==1 ? <ShowImg /> : '' )
                } 
                <MiddleDialog 
                    show={ isShow  }
                    onClose={this.close}
                    className="un-flag-cash-dialog"> 
                        <div className="fpd-img"> 
                            <div className="fhp-dialog">
                                {
                                    showCashType=='first'?
                                    <div className="fhp-num">恭喜! 目标已生效，你已获得奖学金</div>
                                    : showCashType=='change'?
                                    <div className="fhp-num fhp-btm" style={{marginTop:'-24px'}}>
                                        <div>你人缘真好!新加入了</div>
                                        <div>{upNumber}位见证人，奖学金涨到了!</div>
                                    </div> 
                                    :
                                    <div className="fhp-num">{helpNum}位见证人为你带来奖学金</div>
                                }
                                
                                <div className="fhp-money">{formatMoney( money||0)}元</div>
                                <div className="fhp-btn  on-log on-visible" 
                                    data-log-name='去分享'
                                    data-log-region={`un-flag-share-${ showCashType=='first'?'first':showCashType=='change'?'change':'days'}`}
                                    data-log-pos="0" 
                                    onClick={()=> this.onChange(0)}>
                                    <img src="https://img.qlchat.com/qlLive/business/S8V1JO8O-4VXA-EYUV-1560844559523-HFD93CGM733D.png"/>
                                </div>
                            </div>
                        </div> 
                </MiddleDialog>
            </Fragment>
        )
    }
}