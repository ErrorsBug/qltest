import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatDate,digitFormat } from 'components/util';
import Detect from 'components/detect';

class DistributionData extends Component {
    async componentDidMount() {
        await require.ensure([], (require) => {
            this.echarts = require('echarts/lib/echarts');
            require('echarts/lib/chart/pie');
        }, 'echarts');
        this.initPie();
    }
    
    showModifyPop = (e) => {
        this.props.choseModifyKey(e.target.dataset.key)
        this.props.popHandel("modify");
        
    }
    renderUrl = (sourceNo) =>{
        let { businessType, businessId } = this.props
        let preUrl = `${location ? location.origin : 'https://m.qlchat.com'}`
        let url =  `${businessType === 'topic' ? '/topic' : '/live/channel/channelPage'}/${businessId}.htm?sourceNo=${sourceNo}`
        if (businessType === 'channel') {
            url = `${preUrl}/wechat/page/channel-intro?channelId=${businessId}&sourceNo=${sourceNo}`
        } else {
            url = `${preUrl}/topic/details?topicId=${businessId}&pro_cl=${sourceNo}`
        }
        return url                      
    }

    initPie() {

        let pieData = this.props.distributionData.map((item,index) => {
            return {value:item.viewTotal, name:item.sourceName}
        })

        let option = {
            backgroundColor: '#fff',
            color:['#FF3A6F','#FFC76A', '#6FE621', '#4FCCFF', '#4B79F2', '#1D4693' ],
        
            title: {
                text: '',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#999999'
                }
            },
        
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
        
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:pieData.sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#999999',
                                fontSize:Detect.os.ios?24:12
                            },
                            formatter: '{b}\n{c}({d}%)',
                        }
                    },
                    labelLine: {
                        normal: {
                            smooth: 0.2,
                            length: 10,
                            length2: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 100,
                            shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
        
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };

        
        let myChart = this.echarts.init(document.getElementById('main'));
        myChart.setOption(option);
    }

    // 复制提示
    onCopyLink(text, result) {
        if (result) {
            window.toast('复制成功')
        } else {
            window.toast('复制失败，请手动长按复制')
        }
    }
    render() {
        let businessType = this.props.businessType
        return (
            <div className="distribution-data">
                <div className="update-time">数据已更新至{formatDate(this.props.lastStatTime,'yyyy-MM-dd hh:mm:ss')}</div>    
                <div className="pie">
                    <div className="title">
                        <span className='icon-user'>访客来源分布</span>
                    </div>
                    <div className="data-container" >
                        <div id="main"></div>    
                    </div>
                </div>
                <div className="base">
                    <div className="title">
                        <span className='icon-base-channel'>基础渠道</span>
                        <span className="help" onClick={() => {this.props.popHandel("baseApproach")}}></span>
                    </div>
                    <div className="data-container">
                        <div className="flex-wrap">
                            <div className="flex-item"></div>
                            <div className="flex-item middle">访问数</div>
                            <div className="flex-item middle">报名数</div>
                            <div className="flex-item middle">转化率</div>
                        </div>
                        {
                            this.props.distributionData.map((item, index) => {
                                return (
                                    <div className="flex-wrap" key={index}>
                                        <div className="flex-item">{item.sourceName}</div>
                                        <div className="flex-item middle content">{digitFormat(item.viewTotal,10000)}</div>
                                        <div className="flex-item middle content">{digitFormat(item.authTotal,10000)}</div>
                                        <div className="flex-item middle content">
                                            {(item.viewTotal==0||item.authTotal == 0)?"0":parseFloat(((item.authTotal / item.viewTotal * 100).toFixed(2)))}%
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="popularize">
                    <div className="title">
                        <span className='icon-distribution-channel'>推广渠道</span>
                        <span className="help" onClick={() => {this.props.popHandel("popularizeApproach")}}></span>
                    </div>
                    <div className="data-container">
                        <div className="flex-wrap title">
                            <div className="flex-item"></div>
                            <div className="flex-item middle">访问数</div>
                            <div className="flex-item middle">报名数</div>
                            <div className="flex-item middle">转化率</div>
                        </div>

                        {
                            this.props.popularizeChannelList.map((item, index) => {
                                return (
                                    <div className="list-con" key={index} data-id={item.id} >
                                        <div className="flex-wrap-short">
                                            <div className="flex-item edit" data-key={index} onClick={this.showModifyPop} >{item.name}</div>
                                            <div className="flex-item middle content">{digitFormat(item.visitorNum,10000)}</div>
                                            <div className="flex-item middle content">{digitFormat(item.joinCourseNum,10000)}</div>
                                            <div className="flex-item middle content">
                                                <div>{item.visitorNum == 0 ? "0":parseFloat((item.joinCourseNum / item.visitorNum * 100).toFixed(2))}%</div>
                                            </div>
                                        </div>
                                        <div className="flex-wrap">
                                            <div className="flex-item-short">
                                                <span className="l-title grey">推广链接</span>
                                                <CopyToClipboard
                                                    text={this.renderUrl(item.sourceNo)}
                                                    onCopy={this.onCopyLink}
                                                >
                                                    <span className="btn-copy">复制链接</span>
                                                </CopyToClipboard>
                                            </div>
                                            <div className="flex-item-long"><span className="link grey">
                                            {this.renderUrl(item.sourceNo)}
                                        </span></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>    


                </div>
                <div onClick={this.props.addPopularizeChannel} className="add-new-channel">
                        新增推广渠道
                </div>
            </div>
        );
    }
}

export default DistributionData;