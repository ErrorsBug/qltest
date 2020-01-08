import React,{Component} from 'react';
import {
    locationTo,
    formatMoney,
    digitFormat,
    imgUrlFormat,
} from 'components/util';

import { fillParams } from 'components/url-utils';

class LessonItem extends Component {

    state={
        desc:'',
    }

    componentDidMount() {
        if(!this.props.desc){
            var formatedesc=["知识宝箱的专属钥匙","组队听课对抗惰性","畅游在知识的海洋"];
            var randomindex=Math.random(0,1);
            var index=Math.floor(randomindex*(formatedesc.length));
            this.setState({
                desc:formatedesc[index],
            });
        }
    }

    render() {
        var item=this.props;
        return (
            <li className="lesson-item-c on-visible on-log"
                onClick={()=>{
                    let url = null;

                    // 优先按后端返回地址跳转
                    if (item.url) {
                        url = item.url;

                    // 系列课跳转
                    } else if (item.type === 'channel') {
                        url = `/live/channel/channelPage/${item.businessId}.htm`;

                    // 话题跳转
                    } else {
                        url = `/wechat/page/topic-intro?topicId=${item.businessId}`;
                    }


                    // 这里就不和上面的判断放一起了，免得难以阅读
                    // 判断类型，添加渠道参数
                    // 系列课类型
                    if (item.type === 'channel') {
                        url = fillParams({
                            sourceNo: 'subscribe'
                        }, url);

                    // 话题类型
                    } else {
                        url = fillParams({
                            pro_cl: 'subscribe'
                        }, url);
                    }

                    locationTo(url);
                }}
                data-log-region="subscribe_course_list"
                data-log-business_id={item.businessId}
                data-log-name={item.businessName}
                data-log-business_type={item.type}
            >
                <header>
                    <span className="line"></span>
                    <span className="title">{item.desc?item.desc:this.state.desc}</span>
                    <span className="line"></span>
                </header>
                <section className="body">
                    <div className="avatar">
                        <img src={imgUrlFormat(item.logo,"@132w_132h_1e_1c_2o")}/>
                    </div>
                    <div className="info">
                        <p className="title">{item.businessName}</p>
                        {
                            item.type==="channel"?
                            <p className="detail">
                                <span>系列课</span>
                                <span className="line">|</span>
                                <span>已更新{item.topicNum}节</span>
                            </p>
                            :
                            <p className="detail">
                                <span>{item.liveName}</span>
                            </p>
                        }

                        <p className="subscribes">
                            <span className="acount">{digitFormat(item.authNum,10000)}人{item.type==="channel"?"订阅":"次"}</span>
                            {
                                item.money!=-1 ?
                                (item.money>0 ?
                                    (
                                    item.discount == -1 ?
                                        <span className="money">￥{formatMoney(item.money)}</span>
                                        :
                                        <span className="money">
                                            <del>{formatMoney(item.money)}</del>
                                            ￥{formatMoney(item.discount)
                                        }</span>
                                    )

                                :
                                <span className="money-free"></span>
                                ):null
                            }

                        </p>
                    </div>

                </section>
            </li>
        );
    }
}
export default LessonItem;
