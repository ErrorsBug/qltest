import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import RightBottomIcon from '../right-bottom-icon';
import Picture from 'ql-react-picture';
 
 
 

@autobind
export default class extends PureComponent{
     
     
    componentDidMount = () => {  
    };
        
    render() {   
        const  {imgUrl} = this.props
        return (
            <Fragment>
                <div className="ch-to-university">
                    <RightBottomIcon {...this.props}>
                        <div className="cl-td-icon on-visible on-log" 
                            data-log-name="前往大学icon"
                            data-log-region="un-to-university-icon"
                            data-log-pos={0}>
                            <Picture src={imgUrl||`https://img.qlchat.com/qlLive/business/7AEKCH7T-CXJM-M4Q4-1567655614562-N2UGOQ2Y8KVE.png`} /> 
                        </div> 
                    </RightBottomIcon> 
                 
                </div>
               
            </Fragment>
        )
    }
}
