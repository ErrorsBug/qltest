import React, { PureComponent } from 'react'; 
 
export default class extends PureComponent {
    render() {
        const { tagBName, tagCName } = this.props;  
        if(!tagBName&&!tagCName)return false
        return (
            <div className="cs-item-cate">
                {
                   tagBName&& <div className="cs-item-cate-item" dangerouslySetInnerHTML={{__html:tagBName }}></div>
                }
                {
                   tagCName&& <div className="cs-item-cate-item" dangerouslySetInnerHTML={{__html:tagCName }}></div>
                } 
            </div>
        )
    }
}