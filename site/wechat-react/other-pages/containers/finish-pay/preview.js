import React,{Component} from 'react';
import Page from 'components/page';

class FinishPayPasterPreview extends Component {
    constructor(props){
        super(props);
    }

    state = {
    };

    render() {

        return (
            <Page title="预览" className='finish-pay-container'>
                <header className="header success">
                    <div className='icon-pay'></div>
                    <h2 className='pay-title'>支付成功</h2>
                    <div className='btn-goback'>
                        返回
                    </div>
                </header>
                {
                    this.props.location.query.paster &&
                        <div className="paster">
                            <img src={this.props.location.query.paster} alt=""/>
                        </div>
                }
            </Page>
        );
    }
};

module.exports = FinishPayPasterPreview;