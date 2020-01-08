import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import { locationTo } from 'components/util';


@autobind
export default class extends PureComponent{
    render() {
        const { bgUrl, title, decs, tutorLists, code, badgeUrl, info } = this.props;
        const deanObj = tutorLists.filter((item) => Object.is(item.keyC,'Y'))[0] || {};
        return (
            <div className="cl-info-box">
                <div className="cl-info-bg">
                    <Picture src={ bgUrl || '' }/>
                </div>
                <div className="cl-info-badge">
                    <img src={ badgeUrl } />
                </div>
                <div className="cl-info-cont">
                    <h3>{ title }</h3>
                    <p>{ decs }</p>
                    { 
                        (deanObj.keyD||deanObj.keyA)&&<div className="cl-dean-info">
                            {
                                deanObj.keyD&&<img src={ deanObj.keyD }/>
                            }
                            
                            <span>{ deanObj.keyA } | { deanObj.keyB }</span>
                        </div>
                    }
                    <div className="cl-info-decs">
                        <p>{ info }</p>
                    </div>
                    <div className="cl-tutor-box">
                        <div className="cl-tutor-list">
                            { tutorLists.slice(0,5).map((item, index) => (
                                <i key={ index } style={{ zIndex: tutorLists.length - index }}><img src={ item.keyD || "https://img.qlchat.com/qlLive/business/H1D39EOM-X1J5-D55H-1560499366683-6HOJMIUXELV7.png"  } /></i>
                            )) }
                            { !!tutorLists.length && tutorLists.length >= 6 && <i className="cl-tutor-list-more"></i>}
                        </div>

                        <span onClick={ () => {
                            locationTo(`/wechat/page/university/tutor-list?nodeCode=${ code }`)
                        } }>导师详情</span>
                    </div>
                </div>
            </div>
        )
    }
}