import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import RightBottomIcon from '../right-bottom-icon';
import Picture from 'ql-react-picture';
import { isQlchat } from 'components/envi'
 
 
 

@autobind
export default class extends PureComponent{
     
     
    componentDidMount = () => {  
    };
        
    render() {   
        const  {imgUrl} = this.props
        if(isQlchat())return false
        return (
            <Fragment>
                <div className="ch-to-university">
                    <RightBottomIcon {...this.props}>
                        <div className="cl-td-icon on-visible on-log" 
                            data-log-name="前往大学icon"
                            data-log-region="un-to-university-icon"
                            data-log-pos={0}>
                            <Picture src={imgUrl||`https://img.qlchat.com/qlLive/business/2XUG7P7P-JZ36-NJXR-1574665224945-BY6SCAED8BME.png`} /> 
                        </div> 
                    </RightBottomIcon> 
                 
                </div>
               
            </Fragment>
        )
    }
}
