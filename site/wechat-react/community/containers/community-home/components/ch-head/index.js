import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators'; 
import Picture from 'ql-react-picture';
import ImgUpload from '../../../../components/img-upload'
import {  updateStudentInfo } from '../../../../actions/home'

@autobind
export default class extends PureComponent{
    state = { 
        isShowProcess:false
    }
     
    componentDidMount = () => { 
        this.setState({
            bgImgUrl:this.props.bgImgUrl
        })
    };
    componentWillReceiveProps({bgImgUrl}){  
        if(bgImgUrl!==this.props.bgImgUrl){
            this.setState({
                bgImgUrl
            })
        }
    }
    
    updateUserInfo = async (file) => {
        const newFilte = file.map((item) =>  {
            item.type == 'imageId' && (item.url = item.serverId)
            return item
        })
        if(this.isSubmit||!newFilte[0]?.url) return false;
        this.isSubmit = true;
        await updateStudentInfo({bgImgUrl:newFilte[0].url,bgImgType:newFilte[0].type});
        this.setState({
            bgImgUrl:newFilte[0].url,
            localId:newFilte[0].localId,
        })
        window.location.reload()
        this.isSubmit = false; 
    }
     
    render() { 
        const {bgImgUrl,localId} = this.state
        const {isGuest,  communityCards } = this.props;
        return (
            <Fragment>
                <div className={`ch-head ${localId?'ch-head-local':''}`}> 
                    <div className="chh-share on-visible on-log" 
                        data-log-name="分享主页"
                        data-log-region="un-community-share-home"
                        data-log-pos="0" 
                        onClick={communityCards}> 
                        <img src="https://img.qlchat.com/qlLive/business/MA5JPXPA-UE2J-GLLD-1574650063812-WQT8MUTBPLST.png"/> 
                    </div> 
                    {
                        !isGuest&&
                        <div className="chh-share chh-change on-visible on-log" 
                            data-log-name="修改t头图"
                            data-log-region="community-home-headimg"
                            data-log-pos="0" > 
                            <ImgUpload
                                multiple={ true } 
                                count = {1}
                                maxCount = {1}
                                uploadHandle = {this.updateUserInfo}
                            >
                                <img src="https://img.qlchat.com/qlLive/business/9ALOYTM1-DBJD-MF13-1574650250881-8SO6TYOB5248.png"/> 
                            </ImgUpload>
                            
                        </div>
                    }
                    {
                        bgImgUrl!==undefined&&
                        <Picture src={localId||bgImgUrl|| "https://img.qlchat.com/qlLive/business/KH3421YV-RBFT-Y8DD-1574846106581-TM2KHM1QHLJ6.png"  } resize={{w:750,h:380}} placeholder={ false }  />
                    }
                </div> 
            </Fragment>
        )
    }
}
