import React from 'react';

class BottomEditTitle extends React.PureComponent {

    checkIcon = (title) => {
        if(this.props.titleTag == title) {
            return (
                <div className='checkIcon'> <i className='icon_checked'></i></div>
            )
        }
    }

    roleList = ["嘉宾","主讲人","主持人","特邀主持人"]

    listComponent = (roleList) => {
        roleList.map((item) => {
            <div 
                className='list'
            > 
                {item} 
                {this.checkIcon(item)} 
            </div>
        })
    }

    render() {
        return (
            <div 
                className="bottom-set-title" 
                hidden={!this.props.isShow}
                onClick={(e)=>{ if(e.target.className == "bottom-set-title") {this.props.onCloseSettings();}}}
            >
                <div className='cotainer'> 
                    <div className='title'> 设置头衔 </div>
                    {
                        this.roleList.map((item,index) => {
                            return (
                                <div
                                    className='list'
                                    key = {`role-lest-${index}`}
                                    onClick={() => { 
                                        let role ,title;
                                        title = item;
                                        if (item == "特邀主持人") {
                                            role = "compere"
                                        } else {
                                            role = "guest"
                                        }
                                        this.props.setTitle(
                                            this.props.liveId,
                                            role,
                                            title,
                                            this.props.topicId,
                                            this.props.topicInviteId,
                                            this.props.userId,
                                        )

                                        setTimeout(() => {
                                            this.props.onCloseSettings();
                                        }, 500);
                                    }}
                                >
                                    {item}
                                    {this.checkIcon(item)}
                                </div>
                            )
                            
                        })
                    }
                </div>
            </div>
        );
    }
}

export default BottomEditTitle;
