import { imgUrlFormat } from '../../../../comp/util'

Component({
    properties: {
        liveInfo: Object,
    },
    data: {
        uri_card: __uri('./img/vip-card.png'),
        uri_badge: __uri('./img/vip-badge.png'),
        logo: '',
    },
    ready() {
        const {liveInfo} = this.data
        let logo = imgUrlFormat(liveInfo.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100")
        
        this.setData({ logo })
    },
})