import React from 'react'

const Header = ({ userName, userPic, shareName, shareDecs }) => {
    return (
        <>
            <div className="uni-other-header">
                <div className="uni-other-img">
                    <img src={ require('../../img/bg02.png') } />
                </div>
                <div className="uni-other-info">
                    <div className="uni-other-user">
                        <div className="uni-other-pic">
                            <img src={ userPic } alt=""/>
                        </div>
                        <div className="uni-other-decs">
                            <p>{ userName }，你好</p>
                            <span>送你一张女子大学体验卡</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="uni-other-message">
                <div>
                    <h4>寄语</h4>
                    <p>“{ shareDecs }”</p>
                    <span>来自：{ shareName }</span>
                </div>
            </div>
        </>
        
    )
}

export default Header